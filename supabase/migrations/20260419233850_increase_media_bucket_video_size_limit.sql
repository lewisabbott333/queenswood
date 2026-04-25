/*
  # Increase media storage bucket file size limit

  ## Change
  - Raises the file_size_limit on the 'media' storage bucket from 10 MB to 500 MB
  - This allows large video files to be uploaded through the admin dashboard

  ## Notes
  - Previous limit: 10,485,760 bytes (10 MB)
  - New limit: 524,288,000 bytes (500 MB)
*/

UPDATE storage.buckets
SET file_size_limit = 524288000
WHERE id = 'media';
