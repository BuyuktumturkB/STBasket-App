import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  ProductList: [],
  InterfaceList: [],
  totalPrice: 0,
  totalQuantity: 0,
  popUpMessage: null,
  isReset: false,
  isRemovingMode: false,
  isMultiChoosingMode: false,
  optionList: null,
};

export const calculateInfo = ProductList => {
  let totalPrice = 0;
  let totalQuantity = 0;
  ProductList.forEach(product => {
    totalPrice += product.unitPrice * product.quantity;
    totalQuantity += 1;
  });

  return {totalPrice, totalQuantity};
};

const ProductsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    updateBasket: (state, action) => {
      console.log(`action.payload:`, action.payload);
      let msg = null;

      if (action.payload?.popUpMessage != null)
        msg = action.payload.popUpMessage.message;
      
      if (msg === 'PAYMENT_COMPLETED') {
        console.log('ok');
        state.isReset = true;
      } else if (msg === 'MULTICHOOSING_MODE') {
        state.isMultiChoosingMode = true;
        state.optionList = action.payload.optionList;
      } else {
        let rawProducts = action.payload?.productsList;

        if (rawProducts && Array.isArray(rawProducts)) {
          const standardizedProducts = rawProducts.map(product => ({
            ...product,
            imageUri: product.image_url || product.imageUri || action.payload.image_url || null,
          }));

          const isRawZeroPrice = standardizedProducts.some(p => p.totalPrice === 0 || p.unitPrice === 0);

          if (isRawZeroPrice) {
            // 232 Kanalı (Fiyatı 0 gelen ham ürünler): Mevcut sepeti ezmeden ekle/güncelle
            standardizedProducts.forEach(newProduct => {
              const existingIndex = state.ProductList.findIndex(
                p => (newProduct.barcode && p.barcode === newProduct.barcode) || p.name === newProduct.name
              );

              if (existingIndex >= 0) {
                state.ProductList[existingIndex].quantity += (newProduct.quantity || 1);
              } else {
                state.ProductList.push(newProduct);
              }
            });
          } else {
            // 73 STOMP Kanalı (Gerçek fiyatlı tam liste): 
            // 🔑 KRİTİK ÇÖZÜM: 73'ten gelen listede olmayan ama 232'den veya anlık eklenip 
            // henüz 73 sunucusuna yansımamış yerel ürünleri kaybetmemek için koruyoruz (Merge).
            
            const mergedList = [...standardizedProducts];

            state.ProductList.forEach(existingProduct => {
              const foundInIncoming = mergedList.find(
                p => (existingProduct.barcode && p.barcode === existingProduct.barcode) || p.name === existingProduct.name
              );

              // Eğer 73'ten gelen listede bu ürün yoksa, demek ki 232'den yeni eklenmiştir, kaybolmasın diye ekleyelim
              if (!foundInIncoming) {
                mergedList.push(existingProduct);
              }
            });

            state.ProductList = mergedList;
          }
        } 
        else if (action.payload?.product_name) {
          const singleProduct = {
            name: action.payload.product_name,
            barcode: action.payload.barcode || null,
            unitPrice: action.payload.unit_price || 0,
            totalPrice: action.payload.total_price || 0,
            quantity: action.payload.quantity || 1,
            weight: action.payload.weight || 0,
            imageUri: action.payload.image_url || action.payload.imageUri || null,
            basketId: action.payload.basketId || null,
          };

          const existingIndex = state.ProductList.findIndex(p => p.name === singleProduct.name);
          if (existingIndex >= 0) {
            state.ProductList[existingIndex].quantity += singleProduct.quantity;
          } else {
            state.ProductList.push(singleProduct);
          }
        }

        // Toplam tutar ve miktar hesaplaması
        let totalPrice = 0;
        let totalQuantity = 0;

        state.ProductList.forEach(product => {
          totalPrice += product.totalPrice || (product.unitPrice * product.quantity);
          totalQuantity += product.quantity;
        });

        state.InterfaceList = state.ProductList.map(product => {
          return {
            ...product,
            isRemoved: false,
          };
        });

        state.totalPrice = totalPrice;
        state.totalQuantity = totalQuantity;

        if (msg === 'RESET_REMOVING_MODE') {
          state.isRemovingMode = false;
          state.popUpMessage = null;
        } else {
          state.popUpMessage = action.payload?.popUpMessage
            ? {
                message: action.payload.popUpMessage.message,
                productName: action.payload.popUpMessage.productName,
              }
            : null;
        }
      }
    },
    flushPopUp: state => {
      state.popUpMessage = null;
    },
    setRemovingMode: state => {
      state.isRemovingMode = true;
    },
    resetRemovingMode: state => {
      state.isRemovingMode = false;
    },
    resetMultiChoosingMode: state => {
      state.isMultiChoosingMode = false;
      state.optionList = null;
    },
  },
});

export default ProductsSlice.reducer;
export const {
  updateBasket,
  flushPopUp,
  setRemovingMode,
  resetRemovingMode,
  resetMultiChoosingMode,
} = ProductsSlice.actions;