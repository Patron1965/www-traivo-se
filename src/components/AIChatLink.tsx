import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface AIChatLinkProps {
  children: ReactNode;
  className?: string;
}

const AIChatLink = ({ children, className }: AIChatLinkProps) => {
  return (
    <Link to="/hjarna" className={className}>
      {children}
    </Link>
  );
};

export default AIChatLink;
