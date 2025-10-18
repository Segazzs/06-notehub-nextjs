"use client";
interface SearchBoxProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBox({ onChange }: SearchBoxProps) {
  return <input type="text" placeholder="Search notes" onChange={onChange} />;
}
