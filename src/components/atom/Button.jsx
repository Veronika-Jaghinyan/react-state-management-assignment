function Button({ className = 'primary-btn', onClick, name, disabled, type }) {
  return (
    <button className={className} onClick={onClick} disabled={disabled} type={type}>
      {name}
    </button>
  );
}

export default Button;
