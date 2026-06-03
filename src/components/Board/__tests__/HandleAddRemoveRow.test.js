jest.mock('mathjs', () => ({
  resize: (arr, [rows, cols]) => {
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => null)
    );
  }
}));
const { resize } = require('mathjs');

function handleAddRemoveRow(
  isAdd,
  board,
  updateBoard,
  updateIfFeaturedBoard,
  saveApiBoardOperation,
  getDefaultOrdering
) {
  const { grid, tiles } = board;

  if ((!isAdd && grid.rows > 1) || (isAdd && grid.rows < 12)) {
    let newOrder = [];
    const newRows = isAdd ? grid.rows + 1 : grid.rows - 1;

    if (Array.isArray(grid.order) && grid.order.length) {
      newOrder = resize(grid.order, [newRows, grid.columns], null);
    } else {
      newOrder = getDefaultOrdering(tiles);
    }

    const newBoard = {
      ...board,
      tiles,
      grid: {
        ...grid,
        rows: newRows,
        order: newOrder
      }
    };

    const processedBoard = updateIfFeaturedBoard(newBoard);
    updateBoard(processedBoard);
    saveApiBoardOperation(processedBoard);
  }
}

function makeBoard(rows, order = null) {
  return {
    id: 'test-board',
    name: 'Test Board',
    tiles: [{ id: 'tile-1' }, { id: 'tile-2' }],
    grid: { rows, columns: 2, order }
  };
}

function makeMocks() {
  return {
    updateBoard: jest.fn(),
    saveApiBoardOperation: jest.fn(),
    updateIfFeaturedBoard: jest.fn(b => b),
    getDefaultOrdering: jest.fn(() => [['tile-1', 'tile-2']])
  };
}

function run(isAdd, rows, order = null) {
  const board = makeBoard(rows, order);
  const mocks = makeMocks();
  handleAddRemoveRow(
    isAdd,
    board,
    mocks.updateBoard,
    mocks.updateIfFeaturedBoard,
    mocks.saveApiBoardOperation,
    mocks.getDefaultOrdering
  );
  return mocks;
}

describe('handleAddRemoveRow', () => {
  describe('[CAIXA-PRETA] Particionamento de Equivalência', () => {
    it('PE-01 | isAdd=true, rows=5 (classe válida) → deve chamar updateBoard com rows=6', () => {
      const { updateBoard } = run(true, 5);

      expect(updateBoard).toHaveBeenCalled();
      expect(updateBoard.mock.calls[0][0].grid.rows).toBe(6);
    });

    it('PE-02 | isAdd=false, rows=5 (classe válida) → deve chamar updateBoard com rows=4', () => {
      const { updateBoard } = run(false, 5);

      expect(updateBoard).toHaveBeenCalled();
      expect(updateBoard.mock.calls[0][0].grid.rows).toBe(4);
    });

    it('PE-03 | isAdd=false, rows=1 (classe inválida) → NÃO deve chamar updateBoard', () => {
      const { updateBoard } = run(false, 1);

      expect(updateBoard).not.toHaveBeenCalled();
    });

    it('PE-04 | isAdd=true, rows=12 (classe inválida) → NÃO deve chamar updateBoard', () => {
      const { updateBoard } = run(true, 12);

      expect(updateBoard).not.toHaveBeenCalled();
    });
  });

  describe('[CAIXA-PRETA] Análise de Valor Limite', () => {
    it('VL-01 | isAdd=false, rows=1 (mínimo absoluto) → NÃO deve executar', () => {
      const { updateBoard } = run(false, 1);

      expect(updateBoard).not.toHaveBeenCalled();
    });

    it('VL-02 | isAdd=false, rows=2 (primeiro valor válido) → deve executar, rows=1', () => {
      const { updateBoard } = run(false, 2);

      expect(updateBoard).toHaveBeenCalled();
      expect(updateBoard.mock.calls[0][0].grid.rows).toBe(1);
    });

    it('VL-03 | isAdd=true, rows=11 (último valor válido) → deve executar, rows=12', () => {
      const { updateBoard } = run(true, 11);

      expect(updateBoard).toHaveBeenCalled();
      expect(updateBoard.mock.calls[0][0].grid.rows).toBe(12);
    });

    it('VL-04 | isAdd=true, rows=12 (máximo absoluto) → NÃO deve executar', () => {
      const { updateBoard } = run(true, 12);

      expect(updateBoard).not.toHaveBeenCalled();
    });
  });

  describe('[CAIXA-BRANCA] Cobertura de Branches', () => {
    it('BB-01 | order válido → deve usar resize(), NÃO getDefaultOrdering()', () => {
      const order = [[null, null], [null, null]];
      const { updateBoard, getDefaultOrdering } = run(true, 5, order);

      expect(updateBoard).toHaveBeenCalled();
      expect(getDefaultOrdering).not.toHaveBeenCalled();
    });

    it('BB-02 | order=null → deve usar getDefaultOrdering()', () => {
      const { updateBoard, getDefaultOrdering } = run(true, 5, null);

      expect(updateBoard).toHaveBeenCalled();
      expect(getDefaultOrdering).toHaveBeenCalled();
    });

    it('BB-03 | order=[] (array vazio) → deve usar getDefaultOrdering()', () => {
      const { updateBoard, getDefaultOrdering } = run(true, 5, []);

      expect(updateBoard).toHaveBeenCalled();
      expect(getDefaultOrdering).toHaveBeenCalled();
    });
  });

  describe('[CAIXA-BRANCA] MC/DC — Condição de guarda composta', () => {
    it('MC-01 | (!isAdd && rows>1)=true, (isAdd && rows<12)=false → executa', () => {
      const { updateBoard } = run(false, 5);

      expect(updateBoard).toHaveBeenCalled();
    });

    it('MC-02 | (!isAdd && rows>1)=false, (isAdd && rows<12)=true → executa', () => {
      const { updateBoard } = run(true, 5);

      expect(updateBoard).toHaveBeenCalled();
    });

    it('MC-03 | (!isAdd && rows>1)=false, (isAdd && rows<12)=false → NÃO executa', () => {
      const { updateBoard } = run(false, 1);

      expect(updateBoard).not.toHaveBeenCalled();
    });
  });

  describe('[INTEGRAÇÃO] Complementaridade caixa-preta + caixa-branca', () => {
    it('INT-01 | rows=1 bloqueado funcionalmente (PE) e estruturalmente (MC/DC)', () => {
      const { updateBoard } = run(false, 1);

      expect(updateBoard).not.toHaveBeenCalled();
    });

    it('INT-02 | saveApiBoardOperation deve ser chamado junto com updateBoard', () => {
      const { updateBoard, saveApiBoardOperation } = run(true, 5);

      expect(updateBoard).toHaveBeenCalled();
      expect(saveApiBoardOperation).toHaveBeenCalled();
    });

    it('INT-03 | updateIfFeaturedBoard é chamado antes de updateBoard', () => {
      const board = makeBoard(5);
      const mocks = makeMocks();
      const callOrder = [];

      mocks.updateIfFeaturedBoard.mockImplementation(b => {
        callOrder.push('updateIfFeaturedBoard');
        return b;
      });
      mocks.updateBoard.mockImplementation(() => callOrder.push('updateBoard'));

      handleAddRemoveRow(
        true,
        board,
        mocks.updateBoard,
        mocks.updateIfFeaturedBoard,
        mocks.saveApiBoardOperation,
        mocks.getDefaultOrdering
      );

      expect(callOrder).toEqual(['updateIfFeaturedBoard', 'updateBoard']);
    });
  });
});
