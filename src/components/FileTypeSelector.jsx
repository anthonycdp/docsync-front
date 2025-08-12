import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { FileText, Image, X, Check, Upload, Plus } from 'lucide-react'

function FileTypeSelector({ files, availableTypes, typeLabels, onComplete, onCancel, acceptedTypes, maxFiles }) {
  const [assignments, setAssignments] = useState({})
  const [draggedFile, setDraggedFile] = useState(null)
  const [allFiles, setAllFiles] = useState(files)
  
  const getFileIcon = (file) => {
    if (file.type === 'application/pdf') return FileText
    if (file.type.startsWith('image/')) return Image
    return FileText
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const assignFileToType = (fileIndex, fileType) => {
    setAssignments(prev => {
      const newAssignments = { ...prev }
      
      // Remove this file from any previous assignment
      Object.keys(newAssignments).forEach(type => {
        if (newAssignments[type] === fileIndex) {
          delete newAssignments[type]
        }
      })
      
      // Assign to new type
      if (fileType) {
        newAssignments[fileType] = fileIndex
      }
      
      return newAssignments
    })
  }

  const handleAddMoreFiles = () => {
    openFileDialog()
  }

  const handleComplete = () => {
    const result = {}
    Object.entries(assignments).forEach(([fileType, fileIndex]) => {
      result[fileType] = allFiles[fileIndex]
    })
    onComplete(result)
  }

  const handleDragStart = (fileIndex) => {
    setDraggedFile(fileIndex)
  }

  const handleDragEnd = () => {
    setDraggedFile(null)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, fileType) => {
    e.preventDefault()
    if (draggedFile !== null) {
      assignFileToType(draggedFile, fileType)
      setDraggedFile(null)
    }
  }

  const onDropNewFiles = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const updatedFiles = [...allFiles, ...acceptedFiles]
      setAllFiles(updatedFiles)
      // Automatically assign if only one type is available or create new pending assignments
      if (availableTypes.length === 1) {
        const fileType = availableTypes[0]
        acceptedFiles.forEach((file, index) => {
          const fileIndex = allFiles.length + index
          assignFileToType(fileIndex, fileType)
        })
      }
    }
  }

  const { getRootProps: getNewFilesRootProps, getInputProps: getNewFilesInputProps, open: openFileDialog } = useDropzone({
    onDrop: onDropNewFiles,
    accept: acceptedTypes,
    maxFiles: maxFiles - allFiles.length,
    multiple: true,
    noClick: true,
    noKeyboard: true
  })

  const isComplete = availableTypes.length === Object.keys(assignments).length
  const getAssignedType = (fileIndex) => {
    return Object.entries(assignments).find(([type, index]) => index === fileIndex)?.[0]
  }

  const remainingSlots = availableTypes.length - Object.keys(assignments).length
  const canAddMoreFiles = allFiles.length < maxFiles && remainingSlots > 0

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" data-testid="file-type-selector">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Categorizar Arquivos</span>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {allFiles.length} arquivo{allFiles.length !== 1 ? 's' : ''}
                </Badge>
                <Badge variant={isComplete ? "default" : "secondary"}>
                  {Object.keys(assignments).length}/{availableTypes.length}
                </Badge>
              </div>
            </CardTitle>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Associe cada arquivo enviado ao tipo de documento correspondente
              </p>
              {canAddMoreFiles && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddMoreFiles}
                  className="flex items-center space-x-1 text-xs"
                  data-testid="add-more-files-modal"
                >
                  <Plus className="w-3 h-3" />
                  <span>Adicionar Mais</span>
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Available Types - Drop Zones */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Tipos de Documento Necessários:</h4>
              <p className="text-sm text-gray-600 mb-4">Arraste os arquivos para as categorias correspondentes ou use os botões abaixo.</p>
              <div className="grid gap-3">
                {availableTypes.map((fileType) => {
                  const assignedFileIndex = assignments[fileType]
                  const assignedFile = assignedFileIndex !== undefined ? files[assignedFileIndex] : null
                  const isDropTarget = draggedFile !== null
                  
                  return (
                    <motion.div 
                      key={fileType} 
                      className={`
                        flex items-center justify-between p-4 rounded-lg border-2 border-dashed transition-all
                        ${assignedFile ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'}
                        ${isDropTarget ? 'border-blue-400 bg-blue-50 scale-105' : ''}
                      `}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, fileType)}
                      whileHover={{ scale: isDropTarget ? 1.02 : 1 }}
                      data-testid={`drop-zone-${fileType}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          assignedFile ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                        <Badge variant={assignedFile ? "default" : "outline"}>
                          {typeLabels[fileType]}
                        </Badge>
                      </div>
                      {assignedFile ? (
                        <div className="flex items-center space-x-2 text-green-600">
                          <Check className="w-4 h-4" />
                          <span className="text-xs font-medium truncate max-w-32">{assignedFile.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">Solte um arquivo aqui</span>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Files to Assign */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Arquivos Enviados:</h4>
              <div className="grid gap-3">
                {allFiles.map((file, index) => {
                  const FileIcon = getFileIcon(file)
                  const assignedType = getAssignedType(index)
                  const isDragging = draggedFile === index
                  
                  return (
                    <motion.div 
                      key={index} 
                      className={`
                        border rounded-lg p-4 cursor-move transition-all
                        ${isDragging ? 'opacity-50 scale-95 rotate-2' : ''}
                        ${assignedType ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-white'}
                      `}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragEnd={handleDragEnd}
                      whileHover={{ scale: isDragging ? 0.95 : 1.02 }}
                      animate={{
                        opacity: isDragging ? 0.7 : 1,
                        scale: isDragging ? 0.95 : 1
                      }}
                      data-testid={`file-item-${index}`}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          assignedType ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                          <FileIcon className={`w-5 h-5 ${
                            assignedType ? 'text-green-600' : 'text-blue-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                        {assignedType && (
                          <Badge variant="default" className="bg-green-100 text-green-700">
                            {typeLabels[assignedType]}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {availableTypes.map((fileType) => {
                          const isAssigned = assignments[fileType] === index
                          const isOccupied = assignments[fileType] !== undefined && assignments[fileType] !== index
                          
                          return (
                            <Button
                              key={fileType}
                              variant={isAssigned ? "default" : "outline"}
                              size="sm"
                              disabled={isOccupied}
                              onClick={() => assignFileToType(index, isAssigned ? null : fileType)}
                              className="text-xs"
                              data-testid={`assign-button-${fileType}-${index}`}
                            >
                              {isAssigned && <Check className="w-3 h-3 mr-1" />}
                              {typeLabels[fileType]}
                            </Button>
                          )
                        })}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button 
                onClick={handleComplete}
                disabled={!isComplete}
                className="flex-1"
                data-testid="complete-categorization"
              >
                {isComplete ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Confirmar Categorização
                  </>
                ) : (
                  `Categorizar Todos (${Object.keys(assignments).length}/${availableTypes.length})`
                )}
              </Button>
              <Button 
                variant="outline"
                onClick={onCancel}
              >
                Cancelar
              </Button>
            </div>

            {!isComplete && Object.keys(assignments).length > 0 && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800">
                  Ainda faltam {availableTypes.length - Object.keys(assignments).length} arquivo(s) para categorizar
                  {canAddMoreFiles && remainingSlots > 0 && (
                    <span className="block mt-1">
                      Você pode adicionar até {maxFiles - allFiles.length} arquivo(s) a mais
                    </span>
                  )}
                </p>
              </div>
            )}
            
            {/* Hidden dropzone for new files */}
            <div {...getNewFilesRootProps()} className="hidden">
              <input {...getNewFilesInputProps()} />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default FileTypeSelector