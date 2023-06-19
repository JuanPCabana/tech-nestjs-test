export default function getImageFormat(contentType: string): string {
  if(contentType.split('/')[0] !== 'image'){
    return null
  }
  const format = contentType.split('/')[1];
  return format;
}