"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { noteFetch } from "@/lib/api";
import Pagination from "@/components/Pagination/Pagination";
import css from "./page.module.css";
import SearchBox from "@/components/SearchBox/SearchBox";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import NoteList from "@/components/NoteList/NoteList";

export default function NotesClient() {
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");

  const [debouncedText] = useDebounce(text, 800);

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: ["notes", debouncedText, page],
    queryFn: () => noteFetch(debouncedText, page),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedText]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <>
      <div className={css.toolbar}>
        <SearchBox onChange={handleChange} />

        {isSuccess && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <button className={css.button} onClick={handleOpen}>
          Create note +
        </button>

        {isOpen && (
          <Modal onClose={onClose}>
            <NoteForm onClose={onClose} />
          </Modal>
        )}
      </div>

      <div>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error...</p>}
        {isSuccess && <NoteList notes={data.notes} />}
      </div>
    </>
  );
}
