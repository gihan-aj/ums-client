export interface ProfileState {
    isLoading: boolean;
    error: string | null;
}

export const initialProfileState: ProfileState ={
    isLoading:false,
    error: null
}