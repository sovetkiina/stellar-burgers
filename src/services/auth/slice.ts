import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { signUpUser, signInUser, logoutUser, updateUser } from './actions';

interface IUserState {
  user: TUser | null;
  isAuthChecked: boolean;
  error: string | null | undefined;
}

export const initialState: IUserState = {
  user: null,
  isAuthChecked: false,
  error: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpUser.pending, (state) => {
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.error = action.error.message;
        state.isAuthChecked = true;
      });

    builder
      .addCase(signInUser.rejected, (state, action) => {
        state.error = action.error.message;
        state.isAuthChecked = true;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
      });

    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
    });

    builder
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },

  selectors: {
    selectCurrentUser: (state) => state.user,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectUserName: (state) => state.user?.name
  }
});

export const { selectCurrentUser, selectIsAuthChecked, selectUserName } =
  authSlice.selectors;

export const { setUser, setIsAuthChecked } = authSlice.actions;

export default authSlice.reducer;
