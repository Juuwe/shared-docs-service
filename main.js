import { MainPage } from "./pages/main/index.js";
import { HeaderComponent } from './components/header/header.js';



const headerContainer = document.getElementById('header-container');
const root = document.getElementById('root');

const header = new HeaderComponent(headerContainer);
header.render();

const style = document.createElement('style');
style.innerHTML = `
    .product-card {
        transition: background-color 0.3s ease, transform 0.2s ease;
        cursor: pointer;
    }
    .product-card:hover {
        background-color: #ebe9e6 !important;
    }
    .hover-button {
        visibility: hidden;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    .product-card:hover .hover-button {
        visibility: visible;
        opacity: 1;
    }
`;
document.head.appendChild(style);

const mainPage = new MainPage(root);
mainPage.render();
