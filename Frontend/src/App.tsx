import { Provider } from "react-redux"
import { store } from "./store/index"
import AppRouter from "./router/AppRouter"
import { ToastContainer } from "react-toastify"

const App = () => {
  return (
    <Provider store={store}>
      <AppRouter/>
        <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </Provider>
  )
}

export default App
