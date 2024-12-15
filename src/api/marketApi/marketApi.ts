import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { BuyColorDto, BuyPacmanDto, ProductDto, QueryFnError } from "../../models/types";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { RootState } from "../../store/store";

export const marketApi = createApi({
    reducerPath: 'marketApi',
    baseQuery: fakeBaseQuery<QueryFnError>(),
    endpoints: (builder) => ({
        getProducts: builder.query<ProductDto[], undefined>({
            async queryFn(){
                try {
                    const docRef = doc(db, 'market/', 'items');
                    const docSnap = await getDoc(docRef);
                    const products = docSnap.data()?.products as ProductDto[];
                    return {
                        data: products,
                    }
                } catch (error) {
                    return {
                        error: {
                            message: 'Не удалось получить товары.'
                        }
                    }
                }
            }
        }),
        buyColor: builder.mutation<boolean, BuyColorDto>({
            async queryFn(dto, api){
                try {
                    const {getState} = api;
                    const state = getState() as RootState;
                    const {colors, pacmans} = state.user;
                    const newColors = [...colors, dto.color];

                    const docRef = doc(db, "users/", dto.uid);
                    updateDoc(docRef, { marketHistory: {colors: newColors, pacmans} });

                    return {
                        data: true,
                    }
                } catch (error) {
                    return {
                        error: {
                            message: 'Не удалось получить товары.'
                        }
                    }
                }
            }
        }),
        buyPacman: builder.mutation<boolean, BuyPacmanDto>({
            async queryFn(dto, api){
                try {
                    const {getState} = api;
                    const state = getState() as RootState;
                    const {pacmans, colors} = state.user;
                    const newPacmans = [...pacmans, dto.pacman];

                    const docRef = doc(db, "users/", dto.uid);
                    updateDoc(docRef, { marketHistory: {pacmans: newPacmans, colors} });
                    
                    return {
                        data: true,
                    }
                } catch (error) {
                    return {
                        error: {
                            message: 'Не удалось получить товары.'
                        }
                    }
                }
            }
        }),
    })
});

export const {useGetProductsQuery, useBuyColorMutation, useBuyPacmanMutation} = marketApi;