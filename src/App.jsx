import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Channels from "./pages/Channels.jsx";
import ChatRoom from "./pages/ChatRoom.jsx";
import ArticleList from "./pages/ArticleList.jsx";
import ArticleDetail from "./pages/ArticleDetail.jsx";
import NewArticleForm from "./pages/NewArticleForm.jsx";
import NotFound from "./pages/NotFound.jsx";
import Home from "./pages/Home.jsx"; // ✅ Import Home
import UserProfile from "./pages/UserProfile"; // at the top with other imports

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* ✅ Default route goes to Home */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/channels" element={<Channels />} />
        <Route path="/channels/:id" element={<ChatRoom />} />
        <Route path="/articles" element={<ArticleList />} />
        <Route path="/articles/:id" element={<ArticleDetail />} />
        <Route path="/articles/new" element={<NewArticleForm />} />
        <Route path="/users/:id" element={<UserProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;