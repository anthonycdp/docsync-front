export const validateField = (fieldName, value) => {
  const fieldValidatorMap = {
    'client.name': 'name',
    'client.cpf': 'cpf',
    'client.rg': 'rg',
    'client.address': 'address',
    'third.name': 'name',
    'third.cpf': 'cpf', 
    'third.rg': 'rg',
    'third.address': 'address',
    'usedVehicle.brand': 'vehicleBrand',
    'usedVehicle.model': 'vehicleModel',
    'usedVehicle.year': 'vehicleYear',
    'usedVehicle.color': 'vehicleColor',
    'usedVehicle.plate': 'vehiclePlate',
    'usedVehicle.chassi': 'vehicleChassis',
    'usedVehicle.value': 'vehicleValue',
    'newVehicle.brand': 'vehicleBrand',
    'newVehicle.model': 'vehicleModel',
    'newVehicle.yearModel': 'vehicleYear',
    'newVehicle.color': 'vehicleColor',
    'newVehicle.chassi': 'vehicleChassis',
    'payment.amount': 'paymentAmount',
    'payment.method': 'paymentMethod',
    'payment.bank_name': 'bankName',
    'payment.agency': 'agency',
    'payment.account': 'account'
  }
  
  const validatorName = fieldValidatorMap[fieldName]
  
  if (!validatorName) {
    if (!value || value.trim() === '') {
      return { status: 'invalid', message: 'Campo obrigatório' }
    }
    return { status: 'valid', message: 'Válido' }
  }
  
  // Implementar validações diretamente
  switch (validatorName) {
    case 'name':
      if (!value) return { status: 'invalid', message: 'Nome é obrigatório' }
      const nameValue = value.trim()
      if (nameValue.length < 2) return { status: 'invalid', message: 'Nome deve ter pelo menos 2 caracteres' }
      if (nameValue.length > 100) return { status: 'invalid', message: 'Nome não pode ter mais de 100 caracteres' }
      if (!/^[A-ZÀ-ÿ\s]+$/i.test(nameValue)) return { status: 'invalid', message: 'Nome deve conter apenas letras e espaços' }
      const nameParts = nameValue.split(/\s+/).filter(part => part.length > 0)
      if (nameParts.length < 2) return { status: 'warning', message: 'Recomendado incluir nome e sobrenome' }
      return { status: 'valid', message: 'Nome válido' }
      
    case 'cpf':
      if (!value) return { status: 'invalid', message: 'CPF é obrigatório' }
      const cpfValue = value.replace(/[^\d]/g, '')
      if (cpfValue.length !== 11) return { status: 'invalid', message: 'CPF deve ter 11 dígitos' }
      if (/^(\d)\1+$/.test(cpfValue)) return { status: 'invalid', message: 'CPF não pode ter todos os dígitos iguais' }
      let sum = 0
      for (let i = 0; i < 9; i++) {
        sum += parseInt(cpfValue[i]) * (10 - i)
      }
      let remainder = (sum * 10) % 11
      if (remainder === 10) remainder = 0
      if (remainder !== parseInt(cpfValue[9])) return { status: 'invalid', message: 'CPF inválido (primeiro dígito)' }
      sum = 0
      for (let i = 0; i < 10; i++) {
        sum += parseInt(cpfValue[i]) * (11 - i)
      }
      remainder = (sum * 10) % 11
      if (remainder === 10) remainder = 0
      if (remainder !== parseInt(cpfValue[10])) return { status: 'invalid', message: 'CPF inválido (segundo dígito)' }
      return { status: 'valid', message: 'CPF válido' }
      
    case 'rg':
      if (!value) return { status: 'invalid', message: 'RG é obrigatório' }
      const rgValue = value.replace(/[^\dA-Z]/g, '')
      if (rgValue.length < 7) return { status: 'invalid', message: 'RG deve ter pelo menos 7 caracteres' }
      if (rgValue.length > 12) return { status: 'invalid', message: 'RG não pode ter mais de 12 caracteres' }
      return { status: 'valid', message: 'RG válido' }
      
    case 'address':
      if (!value) return { status: 'invalid', message: 'Endereço é obrigatório' }
      const addressValue = value.trim()
      if (addressValue.length < 10) return { status: 'invalid', message: 'Endereço deve ser mais detalhado' }
      if (addressValue.length > 200) return { status: 'invalid', message: 'Endereço muito longo' }
      
      const hasStreetType = /\b(rua|avenida|av|alameda|al|travessa|tv|largo|praça|pça|estrada|est|rodovia|rod)\b/i.test(addressValue)
      const hasNumber = /\d+/.test(addressValue)
      const hasCEP = /\d{5}[.\-]?\d{3}/.test(addressValue)
      
      if (!hasStreetType) {
        return { status: 'warning', message: 'Inclua o tipo de logradouro (Rua, Avenida, etc.)' }
      }
      
      if (!hasNumber) {
        return { status: 'warning', message: 'Inclua o número do endereço' }
      }
      
      if (!hasCEP) {
        return { status: 'warning', message: 'Inclua o CEP' }
      }
      
      return { status: 'valid', message: 'Endereço válido' }
      
    case 'vehicleBrand':
      if (!value) return { status: 'invalid', message: 'Marca é obrigatória' }
      const brandValue = value.trim().toUpperCase()
      if (brandValue.length < 2) return { status: 'invalid', message: 'Marca deve ter pelo menos 2 caracteres' }
      if (brandValue.length > 50) return { status: 'invalid', message: 'Marca não pode ter mais de 50 caracteres' }
      
      const commonBrands = [
        'CHEVROLET', 'TOYOTA', 'VOLKSWAGEN', 'FORD', 'HONDA', 'HYUNDAI', 
        'NISSAN', 'FIAT', 'RENAULT', 'PEUGEOT', 'CITROËN', 'BMW', 'MERCEDES', 
        'AUDI', 'JEEP', 'MITSUBISHI', 'SUZUKI', 'KIA'
      ]
      
      const isKnownBrand = commonBrands.some(knownBrand => 
        brandValue.includes(knownBrand) || knownBrand.includes(brandValue)
      )
      
      if (!isKnownBrand) {
        return { status: 'warning', message: 'Verifique se a marca está correta' }
      }
      
      return { status: 'valid', message: 'Marca válida' }
      
    case 'vehicleModel':
      if (!value) return { status: 'invalid', message: 'Modelo é obrigatório' }
      const modelValue = value.trim()
      if (modelValue.length < 2) return { status: 'invalid', message: 'Modelo deve ter pelo menos 2 caracteres' }
      if (modelValue.length > 100) return { status: 'invalid', message: 'Modelo não pode ter mais de 100 caracteres' }
      
      if (!/^[A-Z0-9À-ÿ\s\.\-\/]+$/i.test(modelValue)) {
        return { status: 'invalid', message: 'Modelo contém caracteres inválidos' }
      }
      
      return { status: 'valid', message: 'Modelo válido' }
      
    case 'vehicleYear':
      if (!value) return { status: 'invalid', message: 'Ano é obrigatório' }
      const yearValue = value.trim()
      if (!/^\d{4}(\/\d{2,4})?$/.test(yearValue)) return { status: 'invalid', message: 'Formato deve ser YYYY ou YYYY/YYYY' }
      
      const currentYear = new Date().getFullYear()
      const [fabricationYear, modelYear] = yearValue.split('/')
      const fabYear = parseInt(fabricationYear)
      
      if (fabYear < 1900 || fabYear > currentYear + 2) {
        return { status: 'invalid', message: `Ano deve estar entre 1900 e ${currentYear + 2}` }
      }
      
      if (modelYear) {
        let modYear = parseInt(modelYear)
        if (modYear < 100) {
          modYear += modYear < 50 ? 2000 : 1900
        }
        if (modYear < fabYear || modYear > currentYear + 2) {
          return { status: 'warning', message: 'Verifique o ano modelo' }
        }
      }
      
      return { status: 'valid', message: 'Ano válido' }
      
    case 'vehicleColor':
      if (!value) return { status: 'invalid', message: 'Cor é obrigatória' }
      const colorValue = value.trim()
      if (colorValue.length < 2) return { status: 'invalid', message: 'Cor deve ter pelo menos 2 caracteres' }
      if (colorValue.length > 30) return { status: 'invalid', message: 'Cor não pode ter mais de 30 caracteres' }
      
      if (!/^[A-ZÀ-ÿ\s\-]+$/i.test(colorValue)) {
        return { status: 'invalid', message: 'Cor deve conter apenas letras, espaços e hífen' }
      }
      
      return { status: 'valid', message: 'Cor válida' }
      
    case 'vehiclePlate':
      if (!value) return { status: 'invalid', message: 'Placa é obrigatória' }
      const plateValue = value.replace(/[^A-Z0-9]/g, '').toUpperCase()
      if (plateValue.length !== 7) return { status: 'invalid', message: 'Placa deve ter 7 caracteres' }
      
      const oldFormat = /^[A-Z]{3}[0-9]{4}$/.test(plateValue)
      const mercosulFormat = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(plateValue)
      
      if (!oldFormat && !mercosulFormat) {
        return { status: 'invalid', message: 'Formato inválido. Use ABC1234 ou ABC1A23' }
      }
      
      return { status: 'valid', message: 'Placa válida' }
      
    case 'vehicleChassis':
      if (!value) return { status: 'invalid', message: 'Chassi é obrigatório' }
      const chassisValue = value.replace(/[^A-Z0-9]/g, '').toUpperCase()
      if (chassisValue.length !== 17) return { status: 'invalid', message: 'Chassi deve ter exatamente 17 caracteres' }
      
      if (/[IOQ]/.test(chassisValue)) {
        return { status: 'invalid', message: 'Chassi não pode conter as letras I, O ou Q' }
      }
      
      if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(chassisValue)) {
        return { status: 'invalid', message: 'Chassi contém caracteres inválidos' }
      }
      
      return { status: 'valid', message: 'Chassi válido' }
      
    case 'vehicleValue':
      if (!value) return { status: 'invalid', message: 'Valor é obrigatório' }
      const cleanValueVehicle = value.replace(/[^\d,\.]/g, '')
      // Handle Brazilian number format (123.456,78) and international format (123456.78)
      const normalizedValueVehicle = cleanValueVehicle.includes(',') && cleanValueVehicle.includes('.') ? 
        cleanValueVehicle.replace(/\./g, '').replace(',', '.') : // Brazilian: 123.456,78 -> 123456.78
        cleanValueVehicle.replace(',', '.') // Simple: 123456,78 -> 123456.78
      const numericValueVehicle = parseFloat(normalizedValueVehicle)
      
      if (isNaN(numericValueVehicle)) {
        return { status: 'invalid', message: 'Valor deve ser numérico' }
      }
      
      if (numericValueVehicle <= 0) {
        return { status: 'invalid', message: 'Valor deve ser maior que zero' }
      }
      
      if (numericValueVehicle < 1000) {
        return { status: 'warning', message: 'Valor parece baixo para um veículo' }
      }
      
      if (numericValueVehicle > 1000000) {
        return { status: 'warning', message: 'Valor parece alto, verifique' }
      }
      
      return { status: 'valid', message: 'Valor válido' }
      
    case 'paymentAmount':
      if (!value) return { status: 'invalid', message: 'Valor pago é obrigatório' }
      const cleanValuePayment = value.replace(/[^\d,\.]/g, '')
      const normalizedValuePayment = cleanValuePayment.includes(',') && cleanValuePayment.includes('.') ? 
        cleanValuePayment.replace(/\./g, '').replace(',', '.') : 
        cleanValuePayment.replace(',', '.')
      const numericValuePayment = parseFloat(normalizedValuePayment)
      
      if (isNaN(numericValuePayment)) {
        return { status: 'invalid', message: 'Valor deve ser numérico' }
      }
      
      if (numericValuePayment <= 0) {
        return { status: 'invalid', message: 'Valor deve ser maior que zero' }
      }
      
      return { status: 'valid', message: 'Valor pago válido' }
      
    case 'paymentMethod':
      if (!value) return { status: 'invalid', message: 'Método de pagamento é obrigatório' }
      const methodValue = value.trim()
      if (methodValue.length < 2) return { status: 'invalid', message: 'Método deve ter pelo menos 2 caracteres' }
      
      const validMethods = ['PIX', 'TED', 'BOLETO', 'DÉBITO', 'CRÉDITO', 'DINHEIRO']
      const isValidMethod = validMethods.some(valid => 
        methodValue.toUpperCase().includes(valid)
      )
      
      if (!isValidMethod) {
        return { status: 'warning', message: 'Verifique o método de pagamento' }
      }
      
      return { status: 'valid', message: 'Método de pagamento válido' }
      
    case 'bankName':
      if (!value) return { status: 'invalid', message: 'Nome do banco é obrigatório' }
      const bankValue = value.trim()
      if (bankValue.length < 2) return { status: 'invalid', message: 'Nome do banco deve ter pelo menos 2 caracteres' }
      return { status: 'valid', message: 'Nome do banco válido' }
      
    case 'agency':
      if (!value) return { status: 'invalid', message: 'Agência é obrigatória' }
      const agencyValue = value.trim()
      if (agencyValue.length < 1) return { status: 'invalid', message: 'Agência deve ter pelo menos 1 caractere' }
      
      if (!/^\d+$/.test(agencyValue)) {
        return { status: 'warning', message: 'Agência deve conter apenas números' }
      }
      
      return { status: 'valid', message: 'Agência válida' }
      
    case 'account':
      if (!value) return { status: 'invalid', message: 'Conta é obrigatória' }
      const accountValue = value.trim()
      if (accountValue.length < 1) return { status: 'invalid', message: 'Conta deve ter pelo menos 1 caractere' }
      return { status: 'valid', message: 'Conta válida' }
      
    default:
      if (!value || value.trim() === '') {
        return { status: 'invalid', message: 'Campo obrigatório' }
      }
      return { status: 'valid', message: 'Válido' }
  }
}

export const validateAllFields = (formData) => {
  const results = {}
  
  const fieldsToValidate = [
    'client.name',
    'client.cpf', 
    'client.rg',
    'client.address',
    'usedVehicle.brand',
    'usedVehicle.model',
    'usedVehicle.year',
    'usedVehicle.color',
    'usedVehicle.plate',
    'usedVehicle.chassi',
    'usedVehicle.value'
  ]
  
  if (formData.newVehicle) {
    fieldsToValidate.push(
      'newVehicle.brand',
      'newVehicle.model',
      'newVehicle.yearModel',
      'newVehicle.color',
      'newVehicle.chassi'
    )
  }
  
  if (formData.third) {
    fieldsToValidate.push(
      'third.name',
      'third.cpf',
      'third.rg', 
      'third.address'
    )
  }

  // CKDEV-NOTE: Adicionar validação para campos de pagamento
  if (formData.payment) {
    fieldsToValidate.push(
      'payment.amount',
      'payment.method',
      'payment.bank_name',
      'payment.agency',
      'payment.account'
    )
  }
  
  fieldsToValidate.forEach(field => {
    const fieldParts = field.split('.')
    let value = formData
    
    for (const part of fieldParts) {
      value = value?.[part]
    }
    
    results[field] = validateField(field, value)
  })
  
  return results
}