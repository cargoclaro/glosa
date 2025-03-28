import type { Partida } from '@/shared/services/customGloss/data-extraction/schemas';
import type React from 'react';
import type { CustomGlossTabTable } from '~/db/schema';
import { cn } from '~/lib/utils';

// --- Type Definitions ---

interface TabInfoSelected {
  name: string;
  isCorrect: boolean;
  isVerified: boolean;
}

interface PedimentoPartidasProps {
  partidas: Partida[];
  tabs?: CustomGlossTabTable[];
  onClick: (keyword: string) => void;
  // Use the original tabInfoSelected structure
  tabInfoSelected?: TabInfoSelected;
}

interface PartidaItemProps {
  partida: Partida;
  index: number;
  onClick: (keyword: string) => void;
  tabs?: CustomGlossTabTable[];
  // Pass down the original tabInfoSelected structure
  tabInfoSelected: TabInfoSelected; // Make it required here, default applied in parent
}

interface CellProps extends React.HTMLAttributes<HTMLDivElement> {
  colSpan?: number;
  isHeader?: boolean;
  align?: 'left' | 'center' | 'right';
  isLast?: boolean;
  isHighlighted?: boolean;
  isValid?: boolean;
}

interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  gridCols?: number;
}

// --- Constants ---
const BORDER_CLASS = 'border-gray-400'; // Default border for internal elements
const DEFAULT_HIGHLIGHT_BORDER_CLASS = 'border-gray-400'; // Default for the outer border-2
const HEADER_BG_CLASS = 'bg-gray-300';
const TEXT_SIZE_CLASS = 'text-[9px]';
const PADDING_CLASS = 'px-1 py-0.5';

// --- Helper Functions ---
const formatNumber = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return '-';
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 5,
  }).format(num);
};

const formatTasa = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return '-';
  return num.toFixed(6);
};

// Determines the BORDER color based on the presence and status in the 'tabs' array
const getHighlightBorderClass = (
  sectionName: string,
  tabs: CustomGlossTabTable[] = []
): string => {
  const tab = tabs.find((t) => t.name === sectionName);
  if (tab) {
    // If a corresponding tab exists, determine border color
    return tab.isCorrect || tab.isVerified
      ? 'border-green-500'
      : 'border-yellow-400';
  }
  // If no corresponding tab, use the default border color for the border-2
  return DEFAULT_HIGHLIGHT_BORDER_CLASS;
};

// --- Sub-Components (Cell, Row, Section Components) ---

const Cell: React.FC<React.PropsWithChildren<CellProps>> = ({
  children,
  colSpan = 1,
  isHeader = false,
  align = 'left',
  isLast = false,
  isHighlighted = false,
  isValid = false,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        PADDING_CLASS,
        TEXT_SIZE_CLASS,
        `col-span-${colSpan}`,
        { 'font-semibold': isHeader },
        { 'border-r': !isLast, [BORDER_CLASS]: !isLast }, // Internal cell border right
        {
          // Only highlight data cells (not headers) and use the correct color based on validation
          'bg-green-100/50': isHighlighted && !isHeader && isValid,
          'bg-yellow-100/50': isHighlighted && !isHeader && !isValid,
        },
        `text-${align}`,
        className
      )}
      {...props}
    >
      {children ?? '-'}
    </div>
  );
};

const Row: React.FC<React.PropsWithChildren<RowProps>> = ({
  children,
  gridCols = 12,
  className,
  ...props
}) => (
  <div
    className={cn(
      'grid',
      `grid-cols-${gridCols}`,
      `border-b ${BORDER_CLASS}`, // Internal row border bottom
      className
    )}
    {...props}
  >
    {children}
  </div>
);

// Partida Title Section (new component)
const PartidaTitleSection: React.FC = () => (
  <Row className={HEADER_BG_CLASS}>
    <Cell isHeader align="center" colSpan={12} isLast>
      PARTIDAS
    </Cell>
  </Row>
);

// --- PartidaHeaderSectionRevised, PartidaDescriptionSection, etc. (Keep with isHighlighted props) ---
const PartidaHeaderSectionRevised: React.FC<{
  partida: Partida;
  isHighlighted: boolean;
  isValid: boolean;
}> = ({ partida, isHighlighted, isValid }) => (
  <>
    <Row>
      <Cell isHeader align="center" colSpan={1}>
        FRACCION
      </Cell>
      <Cell isHeader align="center" colSpan={2}>
        SUBD / NICO
      </Cell>
      <Cell isHeader align="center" colSpan={1}>
        VINC
      </Cell>
      <Cell isHeader align="center" colSpan={1}>
        MET VAL
      </Cell>
      <Cell isHeader align="center" colSpan={1}>
        UMC
      </Cell>
      <Cell isHeader align="center" colSpan={1}>
        CANT UMC
      </Cell>
      <Cell isHeader align="center" colSpan={1}>
        UMT
      </Cell>
      <Cell isHeader align="center" colSpan={1}>
        CANT UMT
      </Cell>
      <Cell isHeader align="center" colSpan={1}>
        P.V/C
      </Cell>
      <Cell isHeader align="center" colSpan={2} isLast>
        P.O/D
      </Cell>
    </Row>
    <Row>
      <Cell colSpan={1} isHighlighted={isHighlighted} isValid={isValid}>
        {partida.fraccion}
      </Cell>
      <Cell colSpan={2} isHighlighted={isHighlighted} isValid={isValid}>
        {partida.nico}
      </Cell>
      <Cell
        align="center"
        colSpan={1}
        isHighlighted={isHighlighted}
        isValid={isValid}
      >
        {partida.vinc}
      </Cell>
      <Cell
        align="center"
        colSpan={1}
        isHighlighted={isHighlighted}
        isValid={isValid}
      >
        {partida.met_val}
      </Cell>
      <Cell
        align="center"
        colSpan={1}
        isHighlighted={isHighlighted}
        isValid={isValid}
      >
        {partida.umc}
      </Cell>
      <Cell
        align="right"
        colSpan={1}
        isHighlighted={isHighlighted}
        isValid={isValid}
      >
        {formatNumber(partida.cantidad_umc)}
      </Cell>
      <Cell
        align="center"
        colSpan={1}
        isHighlighted={isHighlighted}
        isValid={isValid}
      >
        {partida.umt}
      </Cell>
      <Cell
        align="right"
        colSpan={1}
        isHighlighted={isHighlighted}
        isValid={isValid}
      >
        {formatNumber(partida.cantidad_umt)}
      </Cell>
      <Cell colSpan={1} isHighlighted={isHighlighted} isValid={isValid}>
        {partida.p_v_c}
      </Cell>
      <Cell colSpan={2} isLast isHighlighted={isHighlighted} isValid={isValid}>
        {partida.p_o_d}
      </Cell>
    </Row>
  </>
);

const PartidaDescriptionSection: React.FC<{
  partida: Partida;
  partidaNumber: number;
  isHighlighted: boolean;
  isValid: boolean;
}> = ({ partida, partidaNumber, isHighlighted, isValid }) => (
  <>
    <Row>
      <Cell isHeader align="center">
        SEC
      </Cell>
      <Cell isHeader align="center" colSpan={11} isLast>
        DESCRIPCION
      </Cell>
    </Row>
    <Row>
      <Cell align="center" isHighlighted={isHighlighted} isValid={isValid}>
        {partida.sec ?? partidaNumber}
      </Cell>
      <Cell colSpan={11} isLast isHighlighted={isHighlighted} isValid={isValid}>
        {partida.descripcion}
      </Cell>
    </Row>
  </>
);

const PartidaValuationSection: React.FC<{
  partida: Partida;
  isHighlighted: boolean;
  isValid: boolean;
}> = ({ partida, isHighlighted, isValid }) => (
  <>
    <Row>
      <Cell isHeader align="center" colSpan={3}>
        VAL ADU/ USD
      </Cell>
      <Cell isHeader align="center" colSpan={3}>
        IMP. PRECIO PAG.
      </Cell>
      <Cell isHeader align="center" colSpan={3}>
        PRECIO UNIT.
      </Cell>
      <Cell isHeader align="center" colSpan={3} isLast>
        VAL. AGREG.
      </Cell>
    </Row>
    <Row>
      <Cell
        align="right"
        colSpan={3}
        isHighlighted={isHighlighted}
        isValid={isValid}
      >
        {formatNumber(partida.val_adu)}
      </Cell>
      <Cell
        align="right"
        colSpan={3}
        isHighlighted={isHighlighted}
        isValid={isValid}
      >
        {formatNumber(partida.imp_precio_pag)}
      </Cell>
      <Cell
        align="right"
        colSpan={3}
        isHighlighted={isHighlighted}
        isValid={isValid}
      >
        {formatNumber(partida.precio_unit)}
      </Cell>
      <Cell
        align="right"
        colSpan={3}
        isLast
        isHighlighted={isHighlighted}
        isValid={isValid}
      >
        {formatNumber(partida.val_agreg)}
      </Cell>
    </Row>
  </>
);

const PartidaBrandModelSection: React.FC<{
  partida: Partida;
  isHighlighted: boolean;
  isValid: boolean;
}> = ({ partida, isHighlighted, isValid }) => (
  <>
    <Row>
      <Cell isHeader align="center" colSpan={4}>
        MARCA
      </Cell>
      <Cell isHeader align="center" colSpan={4}>
        MODELO
      </Cell>
      <Cell isHeader align="center" colSpan={4} isLast>
        CÓDIGO PRODUCTO
      </Cell>
    </Row>
    <Row>
      <Cell colSpan={4} isHighlighted={isHighlighted} isValid={isValid}>
        {partida.marca}
      </Cell>
      <Cell colSpan={4} isHighlighted={isHighlighted} isValid={isValid}>
        {partida.modelo}
      </Cell>
      <Cell colSpan={4} isLast isHighlighted={isHighlighted} isValid={isValid}>
        {partida.codigo_producto}
      </Cell>
    </Row>
  </>
);

const PartidaContributionsSection: React.FC<{
  partida: Partida;
  isHighlighted: boolean;
  isValid: boolean;
}> = ({ partida, isHighlighted, isValid }) => (
  <>
    <Row className={HEADER_BG_CLASS}>
      <Cell isHeader align="center" colSpan={12} isLast>
        CONTRIBUCIONES
      </Cell>
    </Row>
    <Row gridCols={5}>
      {' '}
      {/* Use 5 columns */}
      <Cell isHeader align="center">
        CON.
      </Cell>
      <Cell isHeader align="center">
        TASA
      </Cell>
      <Cell isHeader align="center">
        T.T.
      </Cell>
      <Cell isHeader align="center">
        F.P.
      </Cell>
      <Cell isHeader align="center" isLast>
        IMPORTE
      </Cell>
    </Row>
    {partida.contribuciones?.map((contribucion, idx) => (
      <Row
        key={idx}
        gridCols={5}
        className={cn({
          'border-b-0': idx === (partida.contribuciones?.length ?? 0) - 1,
        })}
      >
        <Cell isHighlighted={isHighlighted} isValid={isValid}>
          {contribucion.con}
        </Cell>
        <Cell align="right" isHighlighted={isHighlighted} isValid={isValid}>
          {formatTasa(contribucion.tasa)}
        </Cell>
        <Cell align="center" isHighlighted={isHighlighted} isValid={isValid}>
          {contribucion.t_t}
        </Cell>
        <Cell align="center" isHighlighted={isHighlighted} isValid={isValid}>
          {contribucion.f_p}
        </Cell>
        <Cell
          align="right"
          isLast
          isHighlighted={isHighlighted}
          isValid={isValid}
        >
          {formatNumber(contribucion.importe)}
        </Cell>
      </Row>
    ))}
    {(partida.contribuciones?.length ?? 0) === 0 && (
      <Row gridCols={5}>
        <Cell
          colSpan={5}
          align="center"
          isLast
          className="text-gray-500 italic"
          isHighlighted={isHighlighted}
          isValid={isValid}
        >
          Sin contribuciones
        </Cell>
      </Row>
    )}
  </>
);

const PartidaIdentifiersSection: React.FC<{
  partida: Partida;
  isHighlighted: boolean;
  isValid: boolean;
}> = ({ partida, isHighlighted, isValid }) => (
  <>
    <Row className={HEADER_BG_CLASS}>
      <Cell isHeader align="center" colSpan={12} isLast>
        IDENTIFICADORES
      </Cell>
    </Row>
    <Row>
      <Cell isHeader align="center" colSpan={3}>
        IDENTIF.
      </Cell>
      <Cell isHeader align="center" colSpan={3}>
        COMPLEMENTO 1
      </Cell>
      <Cell isHeader align="center" colSpan={3}>
        COMPLEMENTO 2
      </Cell>
      <Cell isHeader align="center" colSpan={3} isLast>
        COMPLEMENTO 3
      </Cell>
    </Row>
    {partida.identificadores?.map((identificador, idx) => (
      <Row
        key={idx}
        className={cn({
          'border-b-0': idx === (partida.identificadores?.length ?? 0) - 1,
        })}
      >
        <Cell
          align="center"
          colSpan={3}
          isHighlighted={isHighlighted}
          isValid={isValid}
        >
          {identificador.clave}
        </Cell>
        <Cell
          align="center"
          colSpan={3}
          isHighlighted={isHighlighted}
          isValid={isValid}
        >
          {identificador.complemento1}
        </Cell>
        <Cell
          align="center"
          colSpan={3}
          isHighlighted={isHighlighted}
          isValid={isValid}
        >
          {identificador.complemento2}
        </Cell>
        <Cell
          align="center"
          colSpan={3}
          isLast
          isHighlighted={isHighlighted}
          isValid={isValid}
        >
          {identificador.complemento3}
        </Cell>
      </Row>
    ))}
    {(partida.identificadores?.length ?? 0) === 0 && (
      <Row>
        <Cell
          colSpan={12}
          align="center"
          isLast
          className="text-gray-500 italic"
          isHighlighted={isHighlighted}
          isValid={isValid}
        >
          Sin identificadores
        </Cell>
      </Row>
    )}
  </>
);

const PartidaObservationsSection: React.FC<{
  partida: Partida;
  isHighlighted: boolean;
  isValid: boolean;
}> = ({ partida, isHighlighted, isValid }) => (
  <>
    <Row className={HEADER_BG_CLASS}>
      <Cell isHeader align="center" colSpan={12} isLast>
        OBSERVACIONES A NIVEL PARTIDA
      </Cell>
    </Row>
    <Row className="border-b-0">
      {' '}
      {/* Last internal row, remove bottom border */}
      <Cell
        colSpan={12}
        isLast
        className="py-2"
        isHighlighted={isHighlighted}
        isValid={isValid}
      >
        {partida.observaciones ? (
          partida.observaciones
        ) : partida.marca || partida.modelo ? (
          <div className="space-y-1">
            {partida.marca && <div>MARCA: {partida.marca}</div>}
            {partida.modelo && <div>MODELO: {partida.modelo}</div>}
          </div>
        ) : (
          '-'
        )}
      </Cell>
    </Row>
  </>
);

// --- Partida Item Component (Modified styling logic) ---

const PartidaItem: React.FC<PartidaItemProps> = ({
  partida,
  index,
  onClick,
  tabs = [],
  tabInfoSelected, // Receive the full object
}) => {
  const partidaNumber = index + 1;
  const partidaSectionName = `Partida ${partidaNumber}`;

  // Use the restored helper functions but only for the border color
  const borderClass = getHighlightBorderClass(partidaSectionName, tabs);

  // Determine if this partida is the one selected
  const isHighlighted = tabInfoSelected.name === partidaSectionName;

  // Determine if this partida is valid (correct or verified)
  const isValid = tabInfoSelected.isCorrect || tabInfoSelected.isVerified;

  return (
    <div
      className={cn(
        'mb-4 cursor-pointer overflow-hidden rounded', // Base styles + rounded corners
        'border-2', // Always apply border-2 thickness
        borderClass // Apply border color (green, yellow, or default gray)
      )}
      onClick={() => onClick(partidaSectionName)}
    >
      {/* Add the PARTIDAS title to each partida item */}
      <PartidaTitleSection />

      {/* Pass isHighlighted and isValid to child components */}
      <PartidaHeaderSectionRevised
        partida={partida}
        isHighlighted={isHighlighted}
        isValid={isValid}
      />
      <PartidaDescriptionSection
        partida={partida}
        partidaNumber={partidaNumber}
        isHighlighted={isHighlighted}
        isValid={isValid}
      />
      <PartidaValuationSection
        partida={partida}
        isHighlighted={isHighlighted}
        isValid={isValid}
      />
      <PartidaBrandModelSection
        partida={partida}
        isHighlighted={isHighlighted}
        isValid={isValid}
      />
      <PartidaContributionsSection
        partida={partida}
        isHighlighted={isHighlighted}
        isValid={isValid}
      />
      <PartidaIdentifiersSection
        partida={partida}
        isHighlighted={isHighlighted}
        isValid={isValid}
      />
      <PartidaObservationsSection
        partida={partida}
        isHighlighted={isHighlighted}
        isValid={isValid}
      />
    </div>
  );
};

// --- Main Component (Modified Props) ---

// Default value for tabInfoSelected, matching the original code
const defaultTabInfo: TabInfoSelected = {
  name: '',
  isCorrect: false,
  isVerified: false,
};

const PedimentoPartidas: React.FC<PedimentoPartidasProps> = ({
  partidas,
  tabs = [],
  onClick,
  tabInfoSelected = defaultTabInfo, // Use the prop as originally defined with a default
}) => {
  if (!partidas || partidas.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 w-full">
      {/* Remove the global PARTIDAS header */}

      {/* Container */}
      <div>
        {partidas.map((partida, index) => (
          <PartidaItem
            key={partida.sec ?? index}
            partida={partida}
            index={index}
            onClick={onClick}
            tabs={tabs}
            tabInfoSelected={tabInfoSelected} // Pass the object down
          />
        ))}
      </div>
    </div>
  );
};

export default PedimentoPartidas;
