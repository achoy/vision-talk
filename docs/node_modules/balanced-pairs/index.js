const superSplit = require('super-split')
const pointInPolygon = require('point-in-polygon')

const block = (start, depth) => {
	const t = {
		start,
		end: null,
		depth,
		pre: '',
		body: '',
		post: '',
		root: false,
		updateBody: newBody => {
			t.newBody = newBody
		},
		delimiter: {},
		children: []
	}

	return t
}

const deepFold = (block, opts, depth = 1) => {
	const blockStrs = block.children.map(block => {
		return block.delimiter.body
	})

	const subs = superSplit(block.body, blockStrs)

	if (typeof subs === 'string') {
		if (block.newBody) {
			return block.newBody
		}

		return block.delimiter.body
	}

	let out = []
	subs.forEach(sub => {
		const child = block.children.find(child => {
			if (child.delimiter.body === sub) {
				return true
			}
			return false
		})

		if (child === undefined) {
			out.push(sub)
		} else {
			const subFold = deepFold(child, opts, depth += 1)
			out.push(subFold)
		}
	})

	if (block.depth === 0) {
		out = out.join('')
	} else {
		out = `{${out.join('')}}`
	}

	if (block.newBody) {
		return block.newBody
	}

	return out
}

module.exports = (content, opts) => {
	const delims = [opts.open, opts.close]
	const particle = superSplit(content, delims)
	const openLen = opts.open.length
	const closeLen = opts.close.length
	const evenDelims = opts.open === opts.close

	const result = {
		blocks: [],
		polygon: [],
		mode: evenDelims ? 'even' : 'odd',
		inside: n => {
			if (result.mode === 'even') {
				return pointInPolygon([n, 0], result.polygon)
			}

			const insideOf = []
			result.list.forEach(block => {
				if (n >= block.start && n <= block.end) {
					insideOf.push(block)
				}
			})

			return insideOf
		},

		flatten: () => {
			const tree = result.blocks.slice()[0]
			return deepFold(tree, opts)
		}
	}

	// Even Delims, ie: "```code``` fence ```code```"
	let run = []
	let n = 0
	let on = false // Only used with evenDelims

	// Off Delims, ie: `foo {bar {baz} quz} spkr}`
	let openDepth = 0
	const stack = []
	const currentItem = {
		start: 0,
		end: content.length - 1,
		depth: 0,
		body: content,
		root: true,
		children: []
	}
	stack.push(currentItem)

	// Map of blocks by level
	const levels = [[]]
	// Add the root block to the levels array
	levels[0].push(currentItem)

	// List of blocks by close-order
	const list = []

	particle.forEach((atom, i) => {
		if (evenDelims === false) {
			const currentItem = stack[stack.length - 1] || undefined

			if (atom === opts.open) {
				openDepth += 1
				if (!levels[openDepth]) {
					levels[openDepth] = []
				}

				const start = n + openLen
				const nextItem = block(start, openDepth)
				if (currentItem) {
					currentItem.children.push(nextItem)
				}
				stack.push(nextItem)
			}

			if (atom === opts.close && currentItem.depth > 0) {
				openDepth -= 1

				const out = n
				if (currentItem) {
					const start = currentItem.start
					const body = content.slice(start, out)
					const end = out - 1
					currentItem.end = end
					currentItem.pre = content.slice(0, start)
					currentItem.body = body
					currentItem.post = content.slice(end + 1)

					const delim = currentItem.delimiter
					delim.start = start - openLen
					delim.end = end + closeLen
					delim.pre = content.slice(0, delim.start)
					delim.body = opts.open + body + opts.close
					delim.post = content.slice(delim.end + 1)

					const item = stack.pop()
					levels[openDepth + 1].push(item)
					list.push(item)
				}
			}

			n += atom.length
		}

		if (evenDelims) {
			n += atom.length

			if (!delims.includes(atom)) {
				return
			}

			on = !on
			const n2 = on ? n : n - closeLen
			run.push(n2)

			if (run.length === 2) {
				const start = run[0]
				const end = run[1] - 1

				// The polygon end is offset due to the
				// way the PIP algorithm defines corners
				const polygon = [
					[start, -1],
					[end + 1, -1],
					[end + 1, 1],
					[start, 1],
					// Close poly
					[start, -1]
				]

				const body = particle[i - 1]

				const block = {
					start,
					end,
					pre: content.slice(0, start),
					body,
					post: content.slice(end + 1),
					polygon,
					delimiter: {
						start: start - openLen,
						end: end + closeLen,
						pre: content.slice(0, start - openLen),
						body: opts.open + body + opts.close,
						post: content.slice(end + 1)
					}
				}

				result.blocks.push(block)
				result.polygon = result.polygon.concat(polygon)

				run = []
			}
		}
	})

	if (!evenDelims) {
		result.blocks = stack
		result.levels = levels
		result.list = list
	}

	return result
}
