import React, { useState, useRef, useCallback } from "react"
import { Text, Flex, Box } from "rebass"

import {
  Th,
  Td,
  Wrapper,
  StyledTable,
  DragHandle,
  InputField,
} from "./elements"

const ENTER_KEY = 13
const TAB_KEY = 9
const ARROW_UP_KEY = 38
const ARROW_DOWN_KEY = 40

const getColumns = (product, edit) => {
  const defaultFields = [
    { header: "TITLE", field: "title" },
    { header: "SKU", field: "sku" },
    { header: "PRICE", field: "price" },
    { header: "EAN", field: "ean" },
    { header: "INVENTORY", field: "inventory_quantity" },
  ]

  if (edit) {
    const optionColumns = product.options.map(o => ({
      header: o.title,
      field: "options",
      changeField: "value",
      formatter: variantOptions => {
        return variantOptions.find(val => val.option_id === o._id).value
      },
    }))

    return [...optionColumns, ...defaultFields]
  } else {
    return [
      {
        header: "",
        field: "options",
        formatter: value => {
          const options = value.map(v => {
            if (v.value) {
              return v.value
            }
            return v
          })

          return options.join(" / ")
        },
        readOnly: true,
        headCol: true,
      },
      ...defaultFields,
    ]
  }
}

const VariantGrid = ({ product, variants, onChange, edit }) => {
  const [dragEnd, setDragEnd] = useState()
  const [selectedCell, setSelectedCell] = useState({})

  const columns = getColumns(product, edit)

  const inputRef = useRef()
  const setRef = useCallback(node => {
    if (node) {
      node.focus()
    }

    inputRef.current = node
  }, [])

  const handleChange = e => {
    const element = e.target
    const [index, field] = e.target.name.split(".")
    const newVariants = [...variants]
    newVariants[index] = {
      ...newVariants[index],
      [field]: element.value,
    }

    setSelectedCell({
      ...selectedCell,
      value: element.value,
    })
    onChange(newVariants)
  }

  const handleDragEnter = e => {
    const element = e.target
    if (selectedCell.col === parseInt(element.dataset.col)) {
      setDragEnd(parseInt(element.dataset.row))
    }
  }

  const handleDragEnd = () => {
    if (selectedCell.row === dragEnd) {
      return
    }

    const bounds = [selectedCell.row, dragEnd]
    const newVariants = [...variants]
    for (let i = Math.min(...bounds); i <= Math.max(...bounds); i++) {
      newVariants[i] = {
        ...newVariants[i],
        [selectedCell.field]: selectedCell.value,
      }
    }

    onChange(newVariants)
    setDragEnd(undefined)
  }

  const isDraggedOver = cell => {
    if (selectedCell.col === cell.col) {
      if (dragEnd > selectedCell.row) {
        return selectedCell.row < cell.row && cell.row <= dragEnd
      } else if (dragEnd < selectedCell.row) {
        return dragEnd <= cell.row && cell.row < selectedCell.row
      }
    }

    return false
  }

  const handleKey = e => {
    switch (e.keyCode) {
      case ENTER_KEY:
        e.preventDefault()
        if (e.shiftKey) {
          if (selectedCell.row > 0) {
            setSelectedCell({
              ...selectedCell,
              row: selectedCell.row - 1,
            })
          }
        } else {
          if (selectedCell.row < variants.length - 1) {
            setSelectedCell({
              ...selectedCell,
              row: selectedCell.row + 1,
            })
          }
        }
        break
      case ARROW_DOWN_KEY:
        if (selectedCell.row < variants.length - 1) {
          setSelectedCell({
            ...selectedCell,
            row: selectedCell.row + 1,
          })
        }
        break
      case ARROW_UP_KEY:
        if (selectedCell.row > 0) {
          setSelectedCell({
            ...selectedCell,
            row: selectedCell.row - 1,
          })
        }
        break
      case TAB_KEY:
        e.preventDefault()
        if (e.shiftKey) {
          if (selectedCell.col > (edit ? 0 : 1)) {
            setSelectedCell({
              ...selectedCell,
              col: selectedCell.col - 1,
            })
          }
        } else {
          if (selectedCell.col < columns.length - 1) {
            setSelectedCell({
              ...selectedCell,
              col: selectedCell.col + 1,
            })
          }
        }
        break
      default:
        break
    }
  }

  const getDisplayValue = (variant, column, isDragged) => {
    const { formatter, field } = column
    if (isDragged) {
      return formatter ? formatter(selectedCell.value) : selectedCell.value
    } else {
      return formatter ? formatter(variant[field]) : variant[field]
    }
  }

  return (
    <Wrapper>
      <StyledTable as="table">
        <thead>
          <tr>
            {columns.map(c => (
              <Th head={c.headCol} key={c.field}>
                {c.header}
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {variants.map((v, row) => (
            <tr key={row}>
              {columns.map((c, col) => (
                <Td
                  key={`${row}-${col}`}
                  data-col={col}
                  data-row={row}
                  dragover={isDraggedOver({ col, row })}
                  onDragEnter={handleDragEnter}
                  onClick={() =>
                    !c.readOnly &&
                    setSelectedCell({
                      field: c.field,
                      value: v[c.field],
                      row,
                      col,
                    })
                  }
                  selected={
                    selectedCell.row === row && selectedCell.col === col
                  }
                  head={c.headCol}
                >
                  {!(selectedCell.row === row && selectedCell.col === col) &&
                    getDisplayValue(v, c, isDraggedOver({ col, row }))}
                  {selectedCell.row === row && selectedCell.col === col && (
                    <>
                      <InputField
                        ref={setRef}
                        onKeyDown={handleKey}
                        name={`${row}.${c.field}`}
                        value={v[c.field] || ""}
                        onChange={handleChange}
                      />
                      <DragHandle draggable onDragEnd={handleDragEnd} />
                    </>
                  )}
                </Td>
              ))}
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </Wrapper>
  )
}

export default VariantGrid
