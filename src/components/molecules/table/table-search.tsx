import React, { useEffect, useRef } from "react"
import clsx from "clsx"
import SearchIcon from "../../fundamentals/icons/search-icon"

type TableSearchProps = {
  onSearch: (term: string) => void
  placeholder?: string
} & React.HTMLAttributes<HTMLDivElement>

const TableSearch: React.FC<TableSearchProps> = ({
  onSearch,
  placeholder = "Search",
  className,
  ...props
}) => {
  const ref = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    console.log(inputRef.current.value)
    inputRef.current.size = inputRef.current.placeholder.replace(
      /\s+/g,
      ""
    ).length
  }, [])
  return (
    <div
      className={clsx(
        "inter-small-regular mt-1 transition-color transition-width duration-150 ease-in-out flex text-grey-50 flex items-center mb-1 pl-1 py-1.5 rounded border border-grey-0 min-w-content focus-within:mr-1 focus-within:w-60 focus-within:shadow-input focus-within:border-violet-60 focus-within:bg-grey-5",
        className
      )}
      {...props}
    >
      <span className="px-2.5 py-0.5">
        <SearchIcon size={16} />
      </span>
      <span ref={ref} className="hidden inline-block">
        {placeholder}
      </span>
      <input
        type="text"
        ref={inputRef}
        className={clsx(
          "focus:outline-none focus:border-none inter-small-regular w-full focus:w-50 focus:bg-grey-5 focus:text-grey-90 caret-violet-60"
        )}
        placeholder={placeholder}
        onChange={(e) => {
          onSearch(e.target.value)
        }}
      />
    </div>
  )
}

export default TableSearch
