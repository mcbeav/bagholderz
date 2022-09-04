import ReactDOM from "react-dom";

import Main from "./components/Main";

import { ToastContainer } from "react-toastify";

document.addEventListener( "DOMContentLoaded", async () => {

    ReactDOM.render(<>
        <Main />
    </>, document.querySelector( "body" ) );

    ReactDOM.render(<>
        <ToastContainer
            position="top-left"
            autoClose={5000}
            closeOnClick={true}
            pauseOnHover={true}
            theme="light"
        />
    </>, document.getElementById( "notifications" ) );

});