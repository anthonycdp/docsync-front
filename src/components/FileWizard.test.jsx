import React from 'react'
import { render, screen } from '@testing-library/react'
import FileWizard from './FileWizard'

// Mock do template para teste
const mockTemplate = {
  id: 'pagamento_terceiro',
  name: 'Pagamento a Terceiro',
  description: 'Template para pagamento a terceiro'
}

// Mock das funções
const mockOnFilesUploaded = jest.fn()
const mockOnCancel = jest.fn()

describe('FileWizard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renderiza corretamente com o template', () => {
    render(
      <FileWizard 
        template={mockTemplate}
        onFilesUploaded={mockOnFilesUploaded}
        onCancel={mockOnCancel}
      />
    )

    // Verifica se os elementos principais estão presentes
    expect(screen.getByText('Assistente de Upload de Documentos')).toBeInTheDocument()
    expect(screen.getByText('Etapa 1 de 3')).toBeInTheDocument()
    expect(screen.getByText('Selecione a Proposta')).toBeInTheDocument()
    expect(screen.getByTestId('upload-area-proposta_pdf')).toBeInTheDocument()
  })

  test('mostra a área de upload corretamente', () => {
    render(
      <FileWizard 
        template={mockTemplate}
        onFilesUploaded={mockOnFilesUploaded}
        onCancel={mockOnCancel}
      />
    )

    const uploadArea = screen.getByTestId('upload-area-proposta_pdf')
    expect(uploadArea).toBeInTheDocument()
    expect(uploadArea).toHaveClass('border-2', 'border-dashed', 'rounded-xl')
  })

  test('mostra o progresso corretamente', () => {
    render(
      <FileWizard 
        template={mockTemplate}
        onFilesUploaded={mockOnFilesUploaded}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByText('Progresso')).toBeInTheDocument()
    expect(screen.getByText('0%')).toBeInTheDocument()
  })
})
