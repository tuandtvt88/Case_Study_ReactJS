import {Route, Routes} from "react-router-dom";
import {Admin_page} from "./components/Admin_page";
import LoginAdmin from "./components/LoginAdmin";
import Register from "./components/Register";
import LoginUser from "./components/LoginUser";
import ProductDetail from "./components/ProductDetail";
import Carts from "./components/Carts";
import {Home} from "./components/Home";



function App() {
    return (
        <>
    <Routes>
        <Route path={'admin'} element={<Admin_page/>}/>
        <Route path={''} element={<LoginAdmin/>}/>
        <Route path={'register'} element={<Register/>}/>
        <Route path={'home'} element={<Home/>}/>
        <Route path={'loginuser'} element={<LoginUser/>}/>
        <Route path={'carts'} element={<Carts/>}/>
        <Route path={'detail/:id'} element={<ProductDetail/>}/>
    </Routes>
        </>
    );
}

export default App;
