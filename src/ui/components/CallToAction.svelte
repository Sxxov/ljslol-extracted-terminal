<script>
	import { onDestroy, onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { push as href } from 'svelte-spa-router';
	import { CSSUtility, WindowUtility } from '../../resources/utilities';
	import { navigatorAppBarScrolledHeight } from '../../resources/stores';
	import { dropIn, dropOut } from '../../core/transitioner';
	import Button from '../blocks/Button.svelte';

	let componentDomContent = null;
	let headingDomContent = null;
	let stringDomContent = null;

	let isHeadingActive = true;
	let isStringActive = true;

	let headingTextContent = '';
	let stringTextContent = '';

	// todo: internationalize
	const HEADING_CHOICES = [
		'intruiged?',
		'interested?',
		'fascinated?',
		'absorbed?',
		'riveted?',
		'captivated?',
		'curious?',
		'entertained?',
		'amused?',
		'attracted?',
	];
	const STRING_CHOICES = [
		'hit me up.',
		'sought me out.',
		'let me know.',
		'ask me out.',
	];

	const { innerWritable } = WindowUtility;
	const heightWritable = writable(0);
	$: inner = $innerWritable;
	$: heightWritable.set(inner.height - $navigatorAppBarScrolledHeight);

	let i = 0;
	let ii = 0;
	const intervalCallback = async () => {
		if (!headingDomContent
			|| !stringDomContent) {
			return;
		}
	
		isHeadingActive = false;

		await new Promise((resolve) => setTimeout(resolve, 100));

		isStringActive = false;

		await new Promise((resolve) => setTimeout(resolve, 200));

		headingTextContent = HEADING_CHOICES[i];
		stringTextContent = STRING_CHOICES[ii];

		isHeadingActive = true;

		await new Promise((resolve) => setTimeout(resolve, 100));

		isStringActive = true;

		i = (i + 1) % HEADING_CHOICES.length;
		ii = (ii + 1) % STRING_CHOICES.length;
	};
	let intervalHandle = null;

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			const { isIntersecting } = entry;

			isHeadingActive = isIntersecting;
			setTimeout(() => {
				isStringActive = isIntersecting;
			}, 300);
	
			if (isIntersecting) {
				intervalHandle = setInterval(intervalCallback, 2000);
				setTimeout(intervalCallback, 300);

				return;
			}

			clearInterval(intervalHandle);
		});
	}, {
		threshold: 0.5,
	});

	onMount(() => {
		observer.observe(componentDomContent);
	});

	onDestroy(() => {
		clearInterval(intervalHandle);
	});
</script>

<component
	bind:this={componentDomContent}
	style='
		--height: {CSSUtility.parse($heightWritable)};
	'
>
	{#if isHeadingActive}
		<heading
			in:dropIn
			out:dropOut
			bind:this={headingDomContent}
		>
			{headingTextContent}
		</heading>
	{/if}
	{#if isStringActive}
		<string
			in:dropIn
			out:dropOut
			bind:this={stringDomContent}
		>
			{stringTextContent}
		</string>
	{/if}
	<container
		class='button'
	>
		<Button
			icon='arrow_forward'
			on:click={() => href('/contact')}
		>
			let's go
		</Button>
	</container>
</component>

<style>
	component {
		display: grid;
		grid-template-rows: 1fr 3rem 1fr;
		grid-template-columns: auto;
		padding: var(--padding);
		box-sizing: border-box;	

		justify-items: center;
		align-items: center;

		width: 100%;
		height: var(--height);
	}

	component heading {
		user-select: none;
		grid-row: 1;
		align-self: flex-end;
	}
	
	component string {
		user-select: none;
		grid-row: 2;
		align-self: flex-start;
	}

	container.button {
		grid-row: 3;
	}
</style>