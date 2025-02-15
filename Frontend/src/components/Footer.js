import '../css/footer.css'
import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer>
            <Link to ="/aboutus" className = "content" >About Us</Link>
            <Link to ="/contactus" className = "content" >Contact Us</Link>
            <a href ="http://localhost:5000/api-docs" className = "content" >See Api documentation </a>
            <p className = "content" >© Group-27</p>
        </footer>
    )
}