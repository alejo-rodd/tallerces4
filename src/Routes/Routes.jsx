import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import TodoList from "../TodoList";
import App from "../App";

const RoutesApp = () => {

    return (
        <BrowserRouter>
            <Routes>

                <Route extact path="/" element={<App />} />
                <Route extact path="/TodoList" element={<TodoList />} />
            </Routes>
        </BrowserRouter>
    )

}

export default RoutesApp;