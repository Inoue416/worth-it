import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface NormalDialogProps {
	title: string;
	description: string;
	cancelText: string;
	confirmText: string;
	onAction: () => void;
	isOpenDialog: boolean;
	setIsOpenDialog: (isOpen: boolean) => void;
}
const NormalDialog = (props: NormalDialogProps) => {
	return (
		<AlertDialog open={props.isOpenDialog} onOpenChange={props.setIsOpenDialog}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{props.title}</AlertDialogTitle>
					<AlertDialogDescription>{props.description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>{props.cancelText}</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							props.onAction();
							props.setIsOpenDialog(false);
						}}
					>
						{props.confirmText}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default NormalDialog;
