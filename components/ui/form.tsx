"use client";

import { cn } from "@/lib/utils";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  createContext,
  useContext,
  useId,
  isValidElement,
  cloneElement,
} from "react";

// Re-export FormProvider as Form for convenience
const Form = FormProvider;

// ========================================
// Context Types & Setup
// ========================================

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

type FormItemContextValue = {
  id: string;
};

const FormFieldContext = createContext<FormFieldContextValue | undefined>(
  undefined
);
const FormItemContext = createContext<FormItemContextValue | undefined>(
  undefined
);

// ========================================
// Main Form Components
// ========================================

/**
 * FormField - Wraps React Hook Form's Controller with context
 */
function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext>
  );
}

/**
 * FormItem - Container for form field with unique ID
 */
function FormItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const id = useId();

  return (
    <FormItemContext value={{ id }}>
      <div className={cn("space-y-2", className)} {...props} />
    </FormItemContext>
  );
}

/**
 * FormLabel - Label with error styling and proper associations
 */
function FormLabel({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  const { error, formItemId } = useFormField();

  return (
    <Label
      className={cn(error && "text-red-500", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
}

/**
 * FormControl - Wrapper that adds accessibility attributes to form controls
 */
function FormControl({
  asChild,
  ...props
}: React.HTMLAttributes<HTMLElement> & { asChild?: boolean }) {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  // Accessibility attributes
  const accessibilityProps = {
    id: formItemId,
    "aria-describedby": !error
      ? formDescriptionId
      : `${formDescriptionId} ${formMessageId}`,
    "aria-invalid": !!error,
  };

  // If asChild is true, clone the child element and add our props
  if (asChild && isValidElement(props.children)) {
    return cloneElement(props.children, {
      ...accessibilityProps,
      ...props,
    });
  }

  // Default: render as div wrapper
  return <div {...accessibilityProps} {...props} />;
}

/**
 * FormDescription - Help text for form fields
 */
function FormDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      id={formDescriptionId}
      className={cn("text-sm text-gray-400", className)}
      {...props}
    />
  );
}

/**
 * FormMessage - Error message display
 */
function FormMessage({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const { error, formMessageId } = useFormField();

  // Show error message or custom children
  const message = error ? String(error?.message) : children;

  // Don't render if no message
  if (!message) {
    return null;
  }

  return (
    <p
      id={formMessageId}
      className={cn("text-sm font-medium text-red-500", className)}
      {...props}
    >
      {message}
    </p>
  );
}

// ========================================
// Custom Hook
// ========================================

/**
 * useFormField - Hook to access form field state and IDs
 * Must be used within FormField and FormItem components
 */
function useFormField() {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  // Validate contexts
  if (!fieldContext) {
    throw new Error("useFormField must be used within <FormField>");
  }
  if (!itemContext) {
    throw new Error("useFormField must be used within <FormItem>");
  }

  // Get field state from React Hook Form
  const fieldState = getFieldState(fieldContext.name, formState);
  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
