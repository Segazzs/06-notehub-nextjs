"use client";

import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
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
  const [text, setText] = useState<string>("");
  const { data, isSuccess } = useQuery({
    queryKey: ["notes", text, page],
    queryFn: () => noteFetch(text, page),
    refetchOnMount: false,
    placeholderData: keepPreviousData,
  });

  console.log(data?.notes);

  const handleChange = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setText(event.target.value),
    1000
  );

  useEffect(() => {
    setPage(1);
  }, [text]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className={css.toolbar}>
        {/* Компонент SearchBox */}
        <SearchBox onChange={handleChange} />

        {/* Пагінація */}
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
      <div>{data?.notes && <NoteList notes={data?.notes} />}</div>
    </>
  );
}
