{
	/* <FormField
control={form.control}
name="workspaceId"
render={({ field }) => (
	<FormItem>
		<FormLabel>Workspace</FormLabel>
		<Select
			onValueChange={field.onChange}
			defaultValue={field.value}
		>
			<FormControl>
				<SelectTrigger>
					<SelectValue placeholder="Select workspace" />
				</SelectTrigger>
			</FormControl>
			<SelectContent>
				{workspaces.map((workspace) => (
					<SelectItem key={workspace.id} value={workspace.id}>
						{workspace.displayName}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
		<FormDescription>
			Select the workspace the bot will be associated with.
		</FormDescription>
		<FormMessage />
	</FormItem>
)}
/>
<FormField
control={form.control}
name="modelId"
render={({ field }) => (
	<FormItem>
		<FormLabel>LLM Model</FormLabel>
		<Select
			onValueChange={field.onChange}
			defaultValue={field.value}
		>
			<FormControl>
				<SelectTrigger>
					<SelectValue placeholder="Select LLM Model" />
				</SelectTrigger>
			</FormControl>
			<SelectContent>
				{models.map((model) => (
					<SelectItem key={model.id} value={model.id}>
						{model.displayName}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
		<FormDescription>
			Select the model to use for the bot.
		</FormDescription>
		<FormMessage />
	</FormItem>
)}
/> */
}
