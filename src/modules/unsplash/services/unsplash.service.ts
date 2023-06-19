import { Injectable } from '@nestjs/common';
import axios from 'axios';
import responseHandler from 'src/helpers/response.helper';

@Injectable()
export class UnsplashService {

  private readonly accessKey = process.env.UNSPLASH_ACCESS_KEY;

  async searchImages(query: string) {
    const url = `https://api.unsplash.com/search/photos?query=${query}`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Client-ID ${this.accessKey}`,
        },
      });

      return responseHandler.handleResponse({ docs: response.data.results });
    } catch (error) {
      return responseHandler.handleErrorResponse(400, 'Error al realizar la búsqueda de imágenes')
    }
  }

}
