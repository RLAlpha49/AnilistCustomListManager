"use client";

// Inspired by react-hot-toast library
import * as React from "react";
import { ToastActionElement, ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 3000;

// Renamed to ToastType to avoid naming conflicts
export interface ToastType extends ToastProps {
	id: string;
	title?: string;
	description?: React.ReactNode;
	action?: ToastActionElement;
}

const actionTypes = {
	ADD_TOAST: "ADD_TOAST",
	UPDATE_TOAST: "UPDATE_TOAST",
	DISMISS_TOAST: "DISMISS_TOAST",
	REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
	count = (count + 1) % Number.MAX_SAFE_INTEGER;
	return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
	| {
			type: ActionType["ADD_TOAST"];
			toast: ToastType;
	  }
	| {
			type: ActionType["UPDATE_TOAST"];
			toast: Partial<ToastType>;
	  }
	| {
			type: ActionType["DISMISS_TOAST"];
			toastId?: ToastType["id"];
	  }
	| {
			type: ActionType["REMOVE_TOAST"];
			toastId?: ToastType["id"];
	  };

interface State {
	toasts: ToastType[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
	memoryState = reducer(memoryState, action);
	listeners.forEach((listener) => {
		listener(memoryState);
	});
}

const addToRemoveQueue = (toastId: string, dispatch: React.Dispatch<Action>, duration: number) => {
	if (toastTimeouts.has(toastId)) {
		return;
	}

	const timeout = setTimeout(() => {
		toastTimeouts.delete(toastId);
		dispatch({
			type: "REMOVE_TOAST",
			toastId: toastId,
		});
	}, duration);

	toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "ADD_TOAST":
			return {
				...state,
				toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
			};

		case "UPDATE_TOAST":
			return {
				...state,
				toasts: state.toasts.map((t) =>
					t.id === action.toast.id ? { ...t, ...action.toast } : t
				),
			};

		case "DISMISS_TOAST": {
			const { toastId } = action;

			// Side effects - schedule removal
			if (toastId) {
				addToRemoveQueue(toastId, dispatch, TOAST_REMOVE_DELAY);
			} else {
				state.toasts.forEach((toast) => {
					addToRemoveQueue(toast.id, dispatch, TOAST_REMOVE_DELAY);
				});
			}

			return {
				...state,
				toasts: state.toasts.map((t) =>
					t.id === toastId || toastId === undefined
						? {
								...t,
								open: false,
						  }
						: t
				),
			};
		}
		case "REMOVE_TOAST":
			if (action.toastId === undefined) {
				return {
					...state,
					toasts: [],
				};
			}
			return {
				...state,
				toasts: state.toasts.filter((t) => t.id !== action.toastId),
			};
		default:
			return state;
	}
};

const autoDismissDurations: Record<string, number> = {
	default: 3000, // 3 seconds
	destructive: 5000, // 5 seconds
	info: 3000, // 3 seconds
	warning: 5000, // 5 seconds
	error: 10000, // 10 seconds
	success: 1000, // 1 second
};

// Updated function name to avoid conflict with the ToastType interface
function createToast({ variant = "info", ...props }: Omit<ToastType, "id">) {
	const id = genId();
	const safeVariant = variant || "default";
	const duration = autoDismissDurations[safeVariant] || 3000;

	const update = (props: Partial<ToastType>) =>
		dispatch({
			type: "UPDATE_TOAST",
			toast: { ...props, id },
		});
	const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

	dispatch({
		type: "ADD_TOAST",
		toast: {
			...props,
			id,
			open: true,
			variant,
			onOpenChange: (open: boolean) => {
				if (!open) dismiss();
			},
		},
	});

	addToRemoveQueue(id, dispatch, duration);

	return {
		id,
		dismiss,
		update,
	};
}

function useToast() {
	const [state, setState] = React.useState<State>(memoryState);

	React.useEffect(() => {
		listeners.push(setState);
		return () => {
			const index = listeners.indexOf(setState);
			if (index > -1) {
				listeners.splice(index, 1);
			}
		};
	}, []);

	return {
		toasts: state.toasts,
		toast: createToast,
		dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
	};
}

export { useToast, createToast as toast };
