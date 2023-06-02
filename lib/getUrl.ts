import { storage } from '@/appwrite'

const getUrl = async (image: Image) => {
  const url = storage.getFileView(image.buckedId, image.fileId)
  return url
}
export default getUrl