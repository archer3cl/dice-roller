import './die.css';

const Dot = () => <span className="dot" />;

const Face = ({ children }) => <div className="face">{children}</div>;

const Die = ({ value }) => {
  let dots = Number.isInteger(value)
    ? Array(value)
        .fill(0)
        .map((_, i) => <Dot key={i} />)
    : null;
  return <Face>{dots}</Face>;
};

export default Die;
