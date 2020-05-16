import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./index.module.css";
import Todo from "../components/todo";
import Form from "../components/form";
import { motion } from "framer-motion";

export default () => {
  const [status, setStatus] = useState("loading");
  const [todos, setTodos] = useState(null);

  useEffect(() => {
    let canceled = false;

    if (status !== "loading") return;

    axios("/api/get-all-todos").then((result) => {
      if (canceled === true) return;

      if (result.status !== 200) {
        console.error("Error loading todos!");
        console.error(result);
        return;
      }

      setTodos(result.data.todos);
      setStatus("loaded"); // so it doesn't try to load todos again
    });

    // whenever the components unmounts set canceled to true
    // basically whenver we navigate away from this page or otherwise unload
    // this will tell react to bail out of finishing this request
    return () => {
      canceled = true;
    };
  }, [status]);

  const reloadTodos = () => setStatus("loading");

  const list = { show: { opacity: 1 } };
  const item = { show: { x: 0, opacity: 1 }, hidden: { x: "-100%" } };

  return (
    <main>
      <h1 className={styles.heading}>JAMstack Todos</h1>
      <Form reloadTodos={reloadTodos} />
      {todos ? (
        <motion.ul className={styles.todos} animate="show" variants={list}>
          {todos.map((todo) => (
            <motion.li
              key={todo._id}
              className={styles.todo}
              animate={status == "loading" ? "hidden" : "show"}
              variants={item}
            >
              <Todo todo={todo} reloadTodos={reloadTodos} />
            </motion.li>
          ))}
        </motion.ul>
      ) : (
        <p className={styles.loading}>loading todos...</p>
      )}
    </main>
  );
};
