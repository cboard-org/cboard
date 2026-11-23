jest.mock('ogv', () => ({
  OGVLoader: { base: '' },
  OGVPlayer: jest.fn()
}));

jest.mock('react-intl', () => ({
  defineMessages: (messages) => messages
}));

jest.mock('../Board.messages', () => ({
  __esModule: true,
  default: {
    scannerManualStrategy: { id: 'scannerManualStrategy', defaultMessage: '' },
    scannerAutomaticStrategy: { id: 'scannerAutomaticStrategy', defaultMessage: '' },
    scannerHowToDeactivate: { id: 'scannerHowToDeactivate', defaultMessage: '' },
    clicksToUnlock: { id: 'clicksToUnlock', defaultMessage: '' }
  }
}));

import { computeScrollState, processTileClick } from '../Board.utils';



describe('computeScrollState', () => {
  describe('Perspectiva Caixa-Preta (Particionamento de Equivalencia e Valor Limite)', () => {
    test('CP01 (CT01): deve retornar isScroll false e totalRows 2 quando itens cabem com folga na grade', () => {
      // Arrange
      const itemCount = 8;
      const cols = 4;
      const rows = 3;

      // Act
      const result = computeScrollState(itemCount, cols, rows);

      // Assert
      expect(result).toEqual({ isScroll: false, totalRows: 2 });
    });

    test('CP02 (CT02): deve retornar isScroll true e totalRows 4 quando itens ultrapassam as linhas visiveis', () => {
      expect(computeScrollState(15, 4, 3)).toEqual({
        isScroll: true,
        totalRows: 4
      });
    });

    test('CP03 (CT03): deve retornar isScroll false e totalRows 0 para quadro vazio (0 itens)', () => {
      expect(computeScrollState(0, 4, 3)).toEqual({
        isScroll: false,
        totalRows: 0
      });
    });

    test.each([
      ['CP04 (CT04) - abaixo da fronteira (11 itens)', 11, 4, 3, false, 3],
      ['CP05 (CT05) - exatamente na fronteira (12 itens)', 12, 4, 3, false, 3],
      ['CP06 (CT06) - imediatamente acima da fronteira (13 itens)', 13, 4, 3, true, 4]
    ])(
      '%s: computeScrollState(%i, %i, %i) -> isScroll=%p, totalRows=%i',
      (_label, itemCount, cols, rows, expectedScroll, expectedRows) => {
        expect(computeScrollState(itemCount, cols, rows)).toEqual({
          isScroll: expectedScroll,
          totalRows: expectedRows
        });
      }
    );
  });

  describe('Perspectiva Caixa-Branca (Complemento Estrutural)', () => {
    test('CB01 (CT07): deve arredondar para 1 linha sem scroll quando houver apenas 1 item', () => {
      expect(computeScrollState(1, 4, 3)).toEqual({
        isScroll: false,
        totalRows: 1
      });
    });
  });

  describe('Ciclos de TDD (Melhorias Defensivas)', () => {
    test.each([
      [12, 0, 3],
      [0, 0, 3],
      [12, -2, 3],
      [12, 4, 0],
      [12, 4, -1]
    ])(
      'TDD01 (CT08): deve retornar { isScroll: false, totalRows: 0 } para dimensoes invalidas (itemCount=%p, cols=%p, rows=%p)',
      (itemCount, cols, rows) => {
        expect(computeScrollState(itemCount, cols, rows)).toEqual({
          isScroll: false,
          totalRows: 0
        });
      }
    );

    test.each([
      [-5, 4, 3],
      [-1, 4, 3],
      [undefined, 4, 3],
      [null, 4, 3],
      [NaN, 4, 3]
    ])(
      'TDD02 (CT09): deve retornar { isScroll: false, totalRows: 0 } quando itemCount for negativo ou invalido (itemCount=%p, cols=%p, rows=%p)',
      (itemCount, cols, rows) => {
        const result = computeScrollState(itemCount, cols, rows);
        expect(result).toEqual({
          isScroll: false,
          totalRows: 0
        });
        expect(Object.is(result.totalRows, 0)).toBe(true);
      }
    );
  });

  describe('Verificacoes Adicionais Pos-TDD (Refinamento e Regressao)', () => {
    test.each([
      [12, Infinity, 3],
      [12, 4, Infinity],
      ['12', 4, 3],
      [12, '4', 3],
      [12, 4, '3']
    ])(
      'RF01 (CT10): deve rejeitar valores nao finitos ou tipos string sem coercao implicita (%p, %p, %p)',
      (itemCount, cols, rows) => {
        expect(computeScrollState(itemCount, cols, rows)).toEqual({
          isScroll: false,
          totalRows: 0
        });
      }
    );

    test('RF02 (CT11): deve calcular corretamente para quadros extensos (1000 itens)', () => {
      expect(computeScrollState(1000, 5, 4)).toEqual({
        isScroll: true,
        totalRows: 200
      });
    });
  });
});

describe('Testes Exploratorios - processTileClick', () => {
  test('EXP01: deve vocalizar e adicionar simbolo comum ao output no fluxo padrao', () => {
    const speak = jest.fn();
    const changeOutput = jest.fn();
    const clickSymbol = jest.fn();
    const tile = { id: 't1', label: 'Agua' };

    const result = processTileClick({
      tile,
      boards: [],
      output: [],
      speak,
      changeOutput,
      clickSymbol
    });

    expect(clickSymbol).toHaveBeenCalledWith('Agua');
    expect(speak).toHaveBeenCalledWith('Agua');
    expect(changeOutput).toHaveBeenCalledWith([tile]);
    expect(result).toEqual({ navigated: false });
  });

  test('EXP02: deve navegar por fallback de nome quando o ID de loadBoard nao existir (risco de quadro homonimo)', () => {
    const changeBoard = jest.fn();
    const onNavigate = jest.fn();
    const onBoardNotFound = jest.fn();
    const tile = { id: 't2', label: 'Comida', loadBoard: 'id-inexistente' };
    const boards = [{ id: 'board-comida', name: 'Comida' }];

    const result = processTileClick({
      tile,
      boards,
      output: [],
      changeBoard,
      onNavigate,
      onBoardNotFound
    });

    expect(changeBoard).toHaveBeenCalledWith('board-comida');
    expect(onNavigate).toHaveBeenCalledWith('board-comida');
    expect(onBoardNotFound).not.toHaveBeenCalled();
    expect(result).toEqual({ navigated: true, nextBoardId: 'board-comida' });
  });

  test('EXP03 (Defeito): deve lancar TypeError quando isLiveMode for true e generateId nao for informado', () => {
    const tile = { id: 't3', label: 'Oi' };

    expect(() =>
      processTileClick({
        tile,
        boards: [],
        output: [],
        isLiveMode: true
      })
    ).toThrow(TypeError);
  });

  test('EXP04 (Defeito): deve lancar TypeError quando tile.action nao for uma string', () => {
    const tile = { id: 't4', label: 'Sim', action: 123 };

    expect(() =>
      processTileClick({
        tile,
        boards: [],
        output: []
      })
    ).toThrow(TypeError);
  });

  test('EXP05 (Defeito): deve lancar TypeError ao clicar em pasta quando boards for undefined', () => {
    const tile = { id: 't5', label: 'Casa', loadBoard: 'b2' };

    expect(() =>
      processTileClick({
        tile,
        boards: undefined,
        output: []
      })
    ).toThrow(TypeError);
  });

  test('EXP06 (Defeito): deve lancar TypeError ao clicar em simbolo quando output for undefined', () => {
    const tile = { id: 't6', label: 'Nao' };

    expect(() =>
      processTileClick({
        tile,
        boards: [],
        output: undefined
      })
    ).toThrow(TypeError);
  });
});