using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Helpers;
using API.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace API.Services
{
    public class PhotoService : IPhotoService
    {
        private readonly Cloudinary _cloudinary;
        public PhotoService(IOptions<CloudinarySettings> config)
        {
            //creating a new cloudinary account
            var cloudinaryAccount = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(cloudinaryAccount);
        }

        public async Task<ImageUploadResult> AddPhotoAsync(IFormFile file)
        {
            var uploadResult = new ImageUploadResult();

            if(file.Length > 0)
            {
                //adding logic to upload the file to cloudinary
                using var stream = file.OpenReadStream();
                var uploadParameters = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    //for the image we will crop it to a square and focus on the face of the person 
                    Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face")
                };
                //uploading the file to cloudinary
                uploadResult = await _cloudinary.UploadAsync(uploadParameters);
            }

            return uploadResult;
        }

        public async Task<DeletionResult> DeletehotoAsync(string publicId)
        {
            var deleteParameters = new DeletionParams(publicId);

            var result = await _cloudinary.DestroyAsync(deleteParameters);

            return result;
        }
    }
}