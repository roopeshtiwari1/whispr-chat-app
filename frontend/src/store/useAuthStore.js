import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast"
import { io } from "socket.io-client"


const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set,get) => ({
  authUser : null,
  isCheckingAuth : true,
  
  isSigningUp : false,
  isLoggingIn : false,
  isUpdatingProfile : false,
  onlineUsers : [],
  socket: null, 

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check")
      // console.log("response in checkAuth", response)
      set({
        authUser: response.data
      })
      get().connectSocket()
      toast.success("Logged in Successfully")
    } catch (error) {
      console.log("Error in check auth:", error)
      set({
        authUser: null
      })
      toast.error("Not logged in")
    }finally{
      set({
        isCheckingAuth: false
      })
    }
  },

  signup: async (data)=> {
    set({
      isSigningUp : true
    })
    try {
      const response = await axiosInstance.post("/auth/signup", data, {
        withCredentials: true
      })
      set({
        authUser : response.data
      })
      get().connectSocket()
      toast.success("Account created Successfully")
    } catch (error) {
      toast.error(error.response.data.message )
    }finally{
      set({
      isSigningUp : false
    })
    }
  },

  login: async (data) => {
      set({ isLoggingIn: true });
      try {
        const res = await axiosInstance.post("/auth/login", data);
        set({ authUser: res.data });
        toast.success("Logged in successfully");
  
        get().connectSocket();
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        set({ isLoggingIn: false });
      }
    },

  logout: async ()=> {
    try {
      await axiosInstance.post("/auth/logout")
      set({
        authUser: null
      })
      get().disconnectSocket()
      toast.success("Logout successfully")
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

   updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: async ()=> {
    const {authUser} = get()
    if(!authUser || get().socket?.connected) return

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id
      },
      path: "/socket.io/",
      withCredentials: true
    }
    )
    socket.connect()

    set({socket: socket})

    socket.on("getOnlineUsers", (userIds)=> {
      set({onlineUsers : userIds})
    })
  },

  disconnectSocket: async ()=> {
    if(get().socket?.connected)  get().socket.disconnect()
  }
}))

