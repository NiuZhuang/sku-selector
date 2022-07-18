import "./index.css";
import Graph from "./graph";
import { useMemo, useState, useCallback, useEffect } from "react";

const SkuSelector = (props) => {
  const { specs, skus, value, onConfirm } = props;

  const [disabledOptions, setDisabledOptions] = useState(new Set([]));

  const [selectedOptions, setSelectedOptions] = useState(new Set([]));

  const [selectedSkuId, setSelectedSkuId] = useState(value);

  const selectedSku = useMemo(() => {
    return skus.find((i) => i.skuId === selectedSkuId);
  }, [skus, selectedSkuId]);

  // 根据 specs optionId 反查 skuId
  const optionIdsToSpecIdMap = useMemo(() => {
    const map = new Map([]);
    skus.forEach((s) => {
      map.set(s.specOptionIds.sort().join(","), s.skuId);
    });
    return map;
  }, [skus]);

  // step 1: generate graph
  const graph = useMemo(() => {
    console.log("step 1: generate graph; useMemo;");
    const skuMatrix = skus.map((s) => s.specOptionIds);
    const specsMatrix = specs.map((s) => s.options.map((o) => o.optionId));
    const g = new Graph([...skuMatrix, ...specsMatrix]);
    g.generateNonEdge();
    return g;
  }, [specs, skus]);

  // step 2: generate selectedNodes, disabledNodes when init
  useEffect(() => {
    const defaultSku = skus.find((i) => i.skuId === value);
    const selectedOptions = new Set(defaultSku?.specOptionIds || []);
    const disabledOptions = new Set(
      [...selectedOptions]
        .map((i) => [...graph.nonEdges.get(i)])
        .reduce((a, b) => [...a, ...b], [])
    );
    console.log(
      "step 2: generate default - useEffect; selectedOptions, disabledOptions",
      selectedOptions,
      disabledOptions
    );

    setSelectedOptions(selectedOptions);
    setDisabledOptions(disabledOptions);
  }, [skus, value, graph.nonEdges]);

  // step 3. generate selected sku
  useEffect(() => {
    // 选择完成
    console.log("step 3: generate selected sku id; useEffect;");
    if (specs.length === selectedOptions.size) {
      const key = [...selectedOptions].sort().join(",");
      const selectedSkuId = optionIdsToSpecIdMap.get(key);
      console.log(
        "optionIdsToSpecIdMap",
        optionIdsToSpecIdMap,
        "key",
        key,
        "selectedSkuId",
        selectedSkuId
      );
      setSelectedSkuId(selectedSkuId);
    } else {
      setSelectedSkuId(value);
    }
  }, [specs, skus, value, selectedOptions, optionIdsToSpecIdMap]);

  // step 3.1: generate view model - specsViewModel

  const specsViewModel = useMemo(() => {
    const specsVM = specs.map((s) => ({
      ...s,
      options: s.options.map((o) => ({
        ...o,
        isSelected: selectedOptions.has(o.optionId),
        isDisabled: disabledOptions.has(o.optionId),
      })),
    }));
    console.log("step 3.1 generate specsViewModel; useMemo;");
    return specsVM;
  }, [specs, disabledOptions, selectedOptions]);

  // step 3.2: generate view model - selectedSkuViewModel

  const selectedSkuViewModel = useMemo(() => {
    console.log("step 3.2 generate selectedSkuViewModel; useMemo;");

    console.log("- selectedSkuViewModel - selectedSku", selectedSku);
    const vm = {
      ...selectedSku,
      stockText: "",
      specsText: "",
    };

    if (selectedOptions.size === specs.length) {
      vm.stockText = `库存：${selectedSku.stock}`;
      vm.specsText = `已选：${selectedSku.specOptionDesc.join("/")}`;
    } else if (selectedOptions.size >= 0) {
      const totalStockNum = skus.map((i) => i.stock).reduce((x, y) => x + y, 0);
      vm.stockText = `库存：${totalStockNum}`;

      if (selectedOptions.size === 0) {
        const text = specs.map((s) => s.label).join("/");
        vm.specsText = `请选择：${text}`;
      } else {
        const text = specs
          .map((s) => s.options)
          .reduce((x, y) => [...x, ...y], [])
          .filter((o) => selectedOptions.has(o.optionId))
          .map((i) => i.label)
          .join("/");
        vm.specsText = `已选：${text}`;
      }
    }
    return vm;
  }, [selectedSku, skus, specs, selectedOptions]);

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

  const getSelectedSiblingOptionId = useCallback(
    (optionId, specId) => {
      return [...specMap.get(specId)].find(
        (x) => selectedOptions.has(x) && x !== optionId
      );
    },
    [specMap, selectedOptions]
  );

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
      graph.nonEdges,
    ]
  );

  return (
    <div className="sku-container">
      <div className="sku-info">
        <div className="sku-info__image">
          {selectedSkuViewModel.specOptionDesc.join(",")}
        </div>
        <div className="sku-info__detail">
          <div className="sku-info__price1">
            {selectedSkuViewModel.priceLabel}:{selectedSkuViewModel.price}
          </div>
          <div className="sku-info__price2">{selectedSkuViewModel.subPriceLabel}:{selectedSkuViewModel.subPrice}</div>
          <div className="sku-info__stock">
            {selectedSkuViewModel.stockText}
          </div>

          <div className="sku-info__stock">
            {selectedSkuViewModel.specsText}
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
                      {specOption.label}
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
