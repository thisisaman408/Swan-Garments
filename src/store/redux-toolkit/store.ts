import { loadState } from "@/components/common/browser-storage";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import filterBrandReducer from "./filterBrand";
import filterPriceReducer from "./filterPrice";
import filterSearchReducer from "./filterSearch";
import filterStatusReducer from "./filterStatus";
import imageReducer from "./imageSlice";
import paginationReducer from "./paginationSlice";
import viewedReducer from "./viewedSlice";
const store = configureStore({
  reducer: {
    cart: cartReducer,
    image: imageReducer,
    filterPrice: filterPriceReducer,
    filterStatus: filterStatusReducer,
    filterSearch: filterSearchReducer,
    viewed: viewedReducer,
    filterBrand: filterBrandReducer,
    pagination: paginationReducer,
  },
  preloadedState: loadState(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
