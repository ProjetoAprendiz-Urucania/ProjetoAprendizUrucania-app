import styles from "./Button.module.css";
import { ButtonProps } from "@mui/material";
import React from "react";

interface CustomButtonProps extends ButtonProps {
  label: string;
  endIcon?: React.ReactNode;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  endIcon,
  label,
  ...props
}) => (
  <button className={styles.customButton} {...props}>
    {label}
    {endIcon}
  </button>
);
