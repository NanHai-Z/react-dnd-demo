import React, {
    useState, useCallback, useRef, useEffect,
  } from 'react';
  import { DndProvider, useDrag, useDrop } from 'react-dnd';
  import { HTML5Backend } from 'react-dnd-html5-backend';
  import update from 'immutability-helper';
  import { CloseOutlined, CloseCircleFilled } from '@ant-design/icons';
  import PropTypes from 'prop-types';
  import './dragModule.scss';
  
  const type = 'DragableBodyRow';
  
  const DragableBodyRow = ({
    index, moveRow, className, style, title, value, onRemoveClick,
  }) => {
    const ref = useRef();
    const [{ isOver, dropClassName }, drop] = useDrop(
      () => ({
        accept: type,
        collect: (monitor) => {
          const { index: dragIndex } = monitor.getItem() || {};
          if (dragIndex === index) {
            return {};
          }
          return {
            isOver: monitor.isOver(),
            dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
          };
        },
        drop: (item) => {
          moveRow(item.index, index);
        },
      }),
      [index, moveRow],
    );
    const [, drag] = useDrag(
      () => ({
        type,
        item: { index },
        // item: (monitor) => {
        //   console.log(monitor);
        // }
        // canDrag: index > 1,
        // 收集器函数
        // collect: monitor => ({
        //   isDragging: monitor.isDragging(),
        // }),
      }),
      [index],
    );
    drag(drop(ref));

    return (
      <div
        ref={ref}
        className={`${className}${isOver ? dropClassName : ''}`}
        style={{ cursor: 'move', ...style }}
      >
        <span className="drag-list-item">
          <span className="drag-list-item-content">{title}</span>
          <CloseOutlined className="drag-list-item-remove" onClick={() => onRemoveClick(value)} />
        </span>
      </div>
    );
  };
  DragableBodyRow.propTypes = {
    index: PropTypes.number,
    moveRow: PropTypes.func.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    title: PropTypes.string,
    value: PropTypes.number,
    onRemoveClick: PropTypes.func,
  };
  
  const DragModule = ({ data, onSelectChange, selectedKeys }) => {
    const [dragData, setData] = useState([]);
    useEffect(() => {
      let currentData = [];
      if (dragData.length > data.length) {
        currentData = dragData.filter(a => data.find(b => a.key === b.key));
      } else {
        currentData = dragData.concat(data.filter(a => !(dragData.find(b => a.key === b.key))));
      }
      setData(currentData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);
  
    const moveRow = useCallback(
      (dragIndex, hoverIndex) => {
        const dragRow = dragData[dragIndex];
        setData(
          update(dragData, {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, dragRow],
            ],
          }),
        );
      },
      [dragData],
    );
  
    const onRemoveClick = (key) => {
      if (key) {
        const newSelectedKeys = selectedKeys.filter(i => i !== key);
        onSelectChange(newSelectedKeys);
      } else {
        onSelectChange([]);
      }
    };

    console.log(dragData);
  
    return (
      <DndProvider backend={HTML5Backend}>
        <div className="tag-select-drag">
          <div className="tag-select-drag-overflow">
            {
              dragData.map((item, index) => (
                <DragableBodyRow key={String(index)} index={index} moveRow={moveRow} title={item.title} value={item.key} onRemoveClick={onRemoveClick} className="drag-list-overflow" />
              ))
            }
          </div>
          <CloseCircleFilled className="tag-select-drag-allclear" onClick={() => onRemoveClick()} />
        </div>
      </DndProvider>
    );
  };
  
  DragModule.propTypes = {
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    onSelectChange: PropTypes.func,
  };
  DragModule.defaultProps = {
    value: undefined,
    onSelectChange: () => {},
  };
  
  export default DragModule;
  