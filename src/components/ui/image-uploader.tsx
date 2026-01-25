'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { ArrowLeftIcon, CircleUserRoundIcon, XIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Cropper, CropperCropArea, CropperDescription, CropperImage } from '@/components/ui/cropper'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'

import { useFileUpload } from '@/hooks/use-file-upload'

// Pixel crop area type
type Area = { x: number; y: number; width: number; height: number }

// Props for the reusable component
export type AvatarCropperProps = {
  /** initial avatar URL (optional). If provided the component will show it. */
  initialImageUrl?: string | null
  /** file accept attribute, default: "image/*" */
  accept?: string
  /** size of the avatar button in px (applies to width/height) */
  size?: number
  /** callback when a cropped image file is produced. Receives (file, objectUrl) */
  onComplete?: (file: File, objectUrl: string) => void
  /** callback when the user removes the final image */
  onRemove?: () => void
  /** optional className for root wrapper */
  className?: string
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  outputWidth: number = pixelCrop.width,
  outputHeight: number = pixelCrop.height,
): Promise<File | null> {
  try {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      return null
    }

    canvas.width = outputWidth
    canvas.height = outputHeight

    ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, outputWidth, outputHeight)

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' })
          resolve(file)
        } else {
          resolve(null)
        }
      }, 'image/jpeg')
    })
  } catch (error) {
    console.error('Error in getCroppedImg:', error)
    return null
  }
}

export function ImageUploader({
  initialImageUrl = null,
  accept = 'image/*',
  size = 64,
  onComplete,
  onRemove,
  className = '',
}: AvatarCropperProps) {
  const [
    { files, isDragging },
    { handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, removeFile, getInputProps },
  ] = useFileUpload({ accept })

  const previewUrl = files[0]?.preview || null
  const fileId = files[0]?.id

  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(initialImageUrl || null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const previousFileIdRef = useRef<string | undefined | null>(null)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    setFinalImageUrl(initialImageUrl || null)
  }, [initialImageUrl])

  const handleCropChange = useCallback((pixels: Area | null) => {
    setCroppedAreaPixels(pixels)
  }, [])

  const handleApply = async () => {
    if (!previewUrl || !fileId || !croppedAreaPixels) {
      if (fileId) {
        removeFile(fileId)
        setCroppedAreaPixels(null)
      }
      setIsDialogOpen(false)
      return
    }

    try {
      const croppedFile = await getCroppedImg(previewUrl, croppedAreaPixels)

      if (!croppedFile) {
        throw new Error('Failed to generate cropped image file.')
      }

      const newFinalUrl = URL.createObjectURL(croppedFile)

      if (finalImageUrl) {
        try {
          if (finalImageUrl.startsWith('blob:')) URL.revokeObjectURL(finalImageUrl)
        } catch {}
      }

      setFinalImageUrl(newFinalUrl)

      onComplete && onComplete(croppedFile, newFinalUrl)

      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error during apply:', error)
      setIsDialogOpen(false)
    }
  }

  const handleRemoveFinalImage = () => {
    if (finalImageUrl) {
      try {
        if (finalImageUrl.startsWith('blob:')) URL.revokeObjectURL(finalImageUrl)
      } catch {}
    }
    setFinalImageUrl(null)
    onRemove && onRemove()
  }

  useEffect(() => {
    const currentFinalUrl = finalImageUrl
    return () => {
      if (currentFinalUrl && currentFinalUrl.startsWith('blob:')) {
        URL.revokeObjectURL(currentFinalUrl)
      }
    }
  }, [finalImageUrl])

  useEffect(() => {
    if (fileId && fileId !== previousFileIdRef.current) {
      setIsDialogOpen(true)
      setCroppedAreaPixels(null)
      setZoom(1)
    }
    previousFileIdRef.current = fileId
  }, [fileId])

  return (
    <div className={className}>
      <div className="relative inline-flex">
        <button
          type="button"
          className={`border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 relative flex items-center justify-center overflow-hidden rounded-full border border-dashed transition-colors outline-none focus-visible:ring-[3px] has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none`}
          style={{ width: size, height: size }}
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          aria-label={finalImageUrl ? 'Change image' : 'Upload image'}>
          {finalImageUrl ? (
            <img
              className="size-full object-cover"
              src={finalImageUrl}
              alt="User avatar"
              width={size}
              height={size}
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div aria-hidden="true">
              <CircleUserRoundIcon className="size-4 opacity-60" />
            </div>
          )}
        </button>

        {finalImageUrl && (
          <Button
            onClick={handleRemoveFinalImage}
            size="icon"
            className="border-background focus-visible:border-background absolute -top-1 -right-1 size-6 rounded-full border-2 shadow-none"
            aria-label="Remove image">
            <XIcon className="size-3.5" />
          </Button>
        )}

        <input {...getInputProps()} className="sr-only" aria-label="Upload image file" tabIndex={-1} />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="gap-0 p-0 sm:max-w-140 *:[button]:hidden">
          <DialogDescription className="sr-only">Crop image dialog</DialogDescription>
          <DialogHeader className="contents space-y-0 text-left">
            <DialogTitle className="flex items-center justify-between border-b p-4 text-base">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="-my-1 opacity-60"
                  onClick={() => setIsDialogOpen(false)}
                  aria-label="Cancel">
                  <ArrowLeftIcon aria-hidden="true" />
                </Button>
                <span>Crop image</span>
              </div>
              <Button className="-my-1" onClick={handleApply} disabled={!previewUrl} autoFocus>
                Apply
              </Button>
            </DialogTitle>
          </DialogHeader>

          {previewUrl && (
            <Cropper
              className="h-96 sm:h-120"
              image={previewUrl}
              zoom={zoom}
              onCropChange={handleCropChange}
              onZoomChange={setZoom}>
              <CropperDescription />
              <CropperImage />
              <CropperCropArea />
            </Cropper>
          )}

          <DialogFooter className="border-t px-4 py-6">
            <div className="mx-auto flex w-full max-w-80 items-center gap-4">
              <ZoomOutIcon className="shrink-0 opacity-60" size={16} aria-hidden="true" />
              <Slider
                defaultValue={[1]}
                value={[zoom]}
                min={1}
                max={3}
                step={0.1}
                onValueChange={(value) => setZoom(value[0])}
                aria-label="Zoom slider"
              />
              <ZoomInIcon className="shrink-0 opacity-60" size={16} aria-hidden="true" />
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
