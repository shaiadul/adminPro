import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  users: [],
  status: "idle",
  error: null,
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const path = "/user/getAllUsers";
  const url = `${API_ENDPOINT}${path}`;

  const token = Cookies.get("token");

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(url, requestOptions);

    const data = await response.json();

    console.log("user form slice: ", data?.data);
    if (!data) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    return await data?.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { getAllUsers } = usersSlice.actions;
export default usersSlice.reducer;
