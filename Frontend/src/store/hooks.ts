import type { TypedUseSelectorHook } from "react-redux";
import { useSelector, useDispatch } from "react-redux";
import type {RootState, AppDispatch} from './index'

//using these instead of plain useDispatch and useSelector
//they are type to our store so no need to every time

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
