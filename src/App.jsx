import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Channels from "./pages/Channels.jsx";
import ChatRoom from "./pages/ChatRoom.jsx";
import ArticleList from "./pages/ArticleList.jsx";
import ArticleDetail from "./pages/ArticleDetail.jsx";
import NewArticleForm from "./pages/NewArticleForm.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/channels" element={<Channels />} />
        <Route path="/channels/:id" element={<ChatRoom />} />
        <Route path="/articles" element={<ArticleList />} />
        <Route path="/articles/:id" element={<ArticleDetail />} />
        <Route path="/articles/new" element={<NewArticleForm />} />
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </Router>
  );
}

export default App;