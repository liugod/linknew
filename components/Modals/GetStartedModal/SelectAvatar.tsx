import { Box, Image, Spinner, Text, useToast, VStack } from '@chakra-ui/react'
import { PosthogEvents } from 'consts/posthog'
import { trackClientEvent } from 'lib/posthog'
import { uploadFile } from 'lib/uploadfile'
import { ChangeEvent, useState } from 'react'
import { BiCamera } from 'react-icons/bi'
import { TUser } from 'types/user'

type GetStartedModalProps = {
  user: TUser
  setUser: (user: TUser) => void
}

const SelectAvatar = ({ user, setUser }: GetStartedModalProps) => {
  const toast = useToast()
  const [loading, setLoading] = useState(false)

  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    setLoading(true)

    try {
      const file = e.target.files?.[0]
      if (!file) {
        toast({
          title: 'Error',
          description: 'No file selected',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
        setLoading(false)
        return
      }

      // Check file size (limit to 5MB for better Vercel performance)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'File size too large. Please select an image under 5MB.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
        setLoading(false)
        return
      }

      const { imageURL, blurpfp, error } = await uploadFile(file, true)

      if (imageURL && !error) {
        setUser({ ...user, pfp: imageURL, blurpfp: blurpfp || '' })
        trackClientEvent({ event: PosthogEvents.UPDATED_AVATAR, user })
        toast({
          title: 'Success',
          description: 'Avatar uploaded successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        toast({
          title: 'Upload Failed',
          description: error || 'Failed to upload avatar. Please try again.',
          status: 'error',
          duration: 10000,
          isClosable: true,
        })
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Upload Failed',
        description: 'An unexpected error occurred. Please try again.',
        status: 'error',
        duration: 10000,
        isClosable: true,
      })
    }

    setLoading(false)
  }

  return (
    <Box h="full">
      <label>
        <input type="file" accept="image/*" onChange={(e) => uploadImage(e)} />
        {loading && (
          <>
            <VStack
              h="full"
              border="1px"
              borderStyle="dashed"
              borderColor="gray.400"
              rounded="md"
              w={28}
              _hover={{ bg: 'gray.100' }}
              cursor="pointer"
              _active={{ bg: 'gray.200' }}
              justify="center"
              transitionDuration="200ms"
            >
              <Spinner size="sm"></Spinner>
              <Text fontSize="xs" textAlign="center" w="full">
                Uploading...
              </Text>
            </VStack>
          </>
        )}
        {!user.pfp && !loading && (
          <VStack
            h="full"
            border="1px"
            borderStyle="dashed"
            borderColor="gray.400"
            rounded="md"
            w={28}
            _hover={{ bg: 'gray.100' }}
            cursor="pointer"
            _active={{ bg: 'gray.200' }}
            justify="center"
            transitionDuration="200ms"
          >
            <BiCamera size={24} />
            <Text fontSize="xs" textAlign="center" w="full">
              Click to upload
            </Text>
          </VStack>
        )}
        {user.pfp && !loading && (
          <VStack
            h="full"
            rounded="md"
            w={28}
            _hover={{ opacity: 0.9 }}
            _active={{ opacity: 0.8 }}
            cursor="pointer"
            justify="center"
            bg="gray.100"
            transitionDuration="200ms"
          >
            <Image src={user.pfp} objectFit="cover" w="100%" h="100%" rounded="md" />
          </VStack>
        )}
      </label>
    </Box>
  )
}

export default SelectAvatar
