import { useLocation, useNavigate } from "react-router-dom";
import { ReactNode, MouseEvent } from "react";

interface AIChatLinkProps {
  children: ReactNode;
  className?: string;
}

const AIChatLink = ({ children, className }: AIChatLinkProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById("ai-chat")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    } else {
      document.getElementById("ai-chat")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <a href="/#ai-chat" onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

export default AIChatLink;
