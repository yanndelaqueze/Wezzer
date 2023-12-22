import s from "./style.module.css";
import { Search as SearchIcon } from "react-bootstrap-icons";
import React, { useState, useEffect } from "react";

export function SearchBar({ onInput, onSubmit, clearInput }) {
  const [inputValue, setInputValue] = useState("");

  function getInput(e) {
    setInputValue(e.target.value);
    onInput(e.target.value);
  }

  function submit(e) {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      setInputValue("");
      onSubmit(e.target.value);
    }
  }

  useEffect(() => {
    setInputValue(inputValue);
  }, [inputValue]);

  // Clear input value when clearInput prop changes
  useEffect(() => {
    if (clearInput) {
      setInputValue("");
    }
  }, [clearInput]);

  return (
    <>
      <SearchIcon size={27} className={s.icon} />
      <input
        className={s.input}
        placeholder="search City"
        onChange={getInput}
        type="text"
        onKeyUp={submit}
      />
    </>
  );
}
