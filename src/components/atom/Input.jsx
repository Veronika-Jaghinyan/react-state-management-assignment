function Input({ id, label, value, onChange, placeholder, maxLength }) {
  const handleOnChange = e => {
    onChange(e.target.value);
  };

  return (
    <div className="input-wrapper">
      <label htmlFor={id} className="label">
        {label}
      </label>
      <input
        id={id}
        value={value}
        className="input"
        type="text"
        placeholder={placeholder}
        onChange={handleOnChange}
        required
        maxLength={maxLength}
      />
    </div>
  );
}

export default Input;
