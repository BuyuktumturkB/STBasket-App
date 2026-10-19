import axios from 'axios';
import {API_URL} from '@env';
import {removeFromOptionsList} from '../slicers/OptionListSlice';

export const removeProduct =
  (productName, weight, basketId, userToken) => async dispatch => {
    try {
      const dto = {
        name: productName,
        weight: weight,
        basketId: basketId,
      };

      const response = await axios.delete(`${API_URL}/product/remove_product`, {
        data: dto,
        headers: {Authorization: `Bearer ${userToken}`},
      });

      dispatch(removeFromOptionsList({name: productName}));
      console.log('Ürün başarılıyla kaldırıldı:', response.data);
    } catch (error) {
      console.log('Ürün kaldırılamadı:', error.response.data);
      dispatch({
        type: 'REMOVE_PRODUCT_FAILURE',
        payload: error.response.data,
      });
    }
  };
