import "./index.css";
import Graph from "./graph";
import { useMemo, useState, useCallback, useEffect } from "react";

const SkuSelector = (props) => {
  const { specs, skus, value, onConfirm } = props;

  const onConfirmHandler = () => {};

  const graph = useMemo(() => {
    const skuMatrix = skus.map((s) => s.specOptionIds);
    const specsMatrix = specs.map((s) => s.options.map((o) => o.optionId));
    const g = new Graph([...skuMatrix, ...specsMatrix]);
    g.generateNonEdge();
    return g;
  }, [specs, skus]);

  const specMap = useMemo(() => {
    const map = new Map();

    specs.forEach((s) => {
      map.set(
        s.specId,
        s.options.map((o) => o.optionId)
      );
    });
    return map;
  }, [specs]);

  const [disabledOptions, setDisabledOptions] = useState(new Set([]));

  const [selectedOptions, setSelectedOptions] = useState(new Set([]));

  const getSelectedSiblingOptionId = useCallback(
    (optionId, specId) => {
      return [...specMap.get(specId)].find(
        (x) => selectedOptions.has(x) && x !== optionId
      );
    },
    [specMap, selectedOptions]
  );

  const [selectedSku, setSelectedSku] = useState({});

  useEffect(() => {
    const defaultSku = skus.find((i) => i.id === value);
    const selectedOptions = new Set(defaultSku?.specOptionIds || []);
    const disabledOptions = new Set(
      [...selectedOptions]
        .map((i) => [...graph.nonEdges.get(i)])
        .reduce((a, b) => [...a, ...b], [])
    );
    console.log(
      "useEffect- selectedOptions, disabledOptions",
      defaultSku,
      selectedOptions,
      disabledOptions
    );
    setSelectedOptions(selectedOptions);
    setDisabledOptions(disabledOptions);
  }, [value, skus, graph.nonEdges]);

  useEffect(()=> {
    let selected = skus.find(x => x.specOptionIds.sort().join(',') === [...selectedOptions].sort().join(','));
   
    setSelectedSku(selected);
  },[skus,value, selectedOptions])



  const specsViewModel = useMemo(() => {
    const viewModel = specs.map((s) => ({
      ...s,
      options: s.options.map((o) => ({
        ...o,
        isSelected: selectedOptions.has(o.optionId),
        isDisabled: disabledOptions.has(o.optionId)
      }))
    }));
    return viewModel;
  }, [specs, disabledOptions, selectedOptions]);

  const onTapOptionHandler = useCallback(
    (event, optionId, specId) => {
      if (disabledOptions.has(optionId)) return;

      const toBeReplacedOptionId = getSelectedSiblingOptionId(optionId, specId);

      
      if (toBeReplacedOptionId) {
        console.log(" onTapOptionHandler - replace");

        selectedOptions.delete(toBeReplacedOptionId);
        selectedOptions.add(optionId);
        setSelectedOptions(new Set([...selectedOptions]));
      } else if (selectedOptions.has(optionId)) {
        console.log(" onTapOptionHandler - deselect");

        // deselect 反选
        selectedOptions.delete(optionId);
        setSelectedOptions(new Set([...selectedOptions]));
      } else {
        console.log(" onTapOptionHandler - select", optionId);
        selectedOptions.add(optionId);
        // select 选择
        setSelectedOptions(new Set([...selectedOptions, optionId]));
      }
      console.log("onTapOptionHandler - selectedOptions", selectedOptions);

      let unreachableNodes = new Set(
        [...selectedOptions]
          .map((i) => graph.nonEdges.get(i))
          .reduce((a, b) => {
            return [...a, ...b];
          }, [])
      );

      console.log("selectedOptions", selectedOptions);
      console.log("disabledOptions", unreachableNodes);

      setDisabledOptions(unreachableNodes);
    },
    [
      selectedOptions,
      disabledOptions,
      getSelectedSiblingOptionId,
      graph.nonEdges
    ]
  );

  return (
    <div className="sku-container">
      <div className="sku-info">
        <div className="sku-info__image">图片</div>
        <div className="sku-info__detail">
          <div className="sku-info__price1"></div>
          <div className="sku-info__price2"></div>
          <div className="sku-info__stock">库存：{selectedSku?.stock}</div>

          <div className="sku-info__stock">
            已选：{selectedSku?.specOptionDesc?.join("/")}
          </div>
        </div>
      </div>

      <div className="spec-container">
        {specsViewModel.map((specItem) => {
          return (
            <div key={specItem.specId}>
              <div className="spec-title"> {specItem.label}</div>
              <div className="spec-list">
                {specItem.options?.map((specOption) => {
                  return (
                    <div
                      className={`spec-item ${
                        specOption.isDisabled ? "spec-item_disabled" : null
                      }  ${
                        specOption.isSelected ? "spec-item_selected" : null
                      }`}
                      key={specOption.optionId}
                      onClick={(event) =>
                        onTapOptionHandler(
                          event,
                          specOption.optionId,
                          specItem.specId
                        )
                      }
                    >
                      ({specOption.optionId}){specOption.label}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkuSelector;
