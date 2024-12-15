import { ProductDto } from "../../models/types";

export const useSortProducts = (list: ProductDto[])=> {
    const colors = list.filter(item=> item.type === 'color');
    const pacmans = list.filter(item=> item.type === 'pacman');

    return [colors, pacmans];
}